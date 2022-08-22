const fs = require("fs");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const { middleware } = require("express-openapi-validator");

const spdy = require("spdy");

const mongoose = require("./helpers/mongoose");
const logger = require("./helpers/logger");
const loggerHttp = require("./helpers/loggerHttp");

const Router = require("./routes");
const packageJson = require("../package.json");

let newrelic;

if (process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME) {
  newrelic = require("newrelic");
}

const { BODY_LIMIT, NODE_ENV, PORT } = process.env;

class App {
  constructor() {
    /**
     * @var {express} app
     */
    this.app = app;
  }

  test() {
    this.app.use(express.json({ limit: BODY_LIMIT }));
    this.app.use(express.urlencoded({ extended: true }));
    this._routes();
    return this.app;
  }

  _onListening() {
    if (NODE_ENV !== "test") {
      logger.info(`Started ${packageJson.name} at port ${PORT} in ${NODE_ENV} environment`);
    }
  }

  _onError(err) {
    logger.error(`App Crashed, Error: ${err.errorMessage}`);
    process.exit;
  }

  init() {
    if (NODE_ENV !== "test") {
      this._configure();
      if (NODE_ENV === "production") {
        if (process.env.CERT_KEY && process.env.CERT_PATH) {
          const options = {
            key: fs.readFileSync(process.env.CERT_KEY),
            cert: fs.readFileSync(process.env.CERT_PATH),
            spdy: { protocols: ["h2", "http/1.1", "http/2"] },
          };
          spdy.createServer(options, this.app).listen(PORT, (err) => {
            if (err) {
              return this._onError(err);
            }
            this._onListening();
          });
        } else {
          this.app.listen(PORT, this._onListening);
          this.app.on("error", this._onError);
        }
      } else {
        this.app.listen(PORT, this._onListening);
        this.app.on("error", this._onError);
      }
      return this.app;
    }
  }

  _configure() {
    mongoose.configure();
    this._middleWares();
    return this._routes();
  }

  _middleWares() {
    this.app.use(express.json({ limit: BODY_LIMIT }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    if (NODE_ENV !== "test") {
      this.app.use(function (req, res, next) {
        if (newrelic) {
          newrelic.setTransactionName(req.url);
        }
        function afterResponse() {
          res.removeListener("finish", afterResponse);
          res.removeListener("close", afterResponse);
          loggerHttp.loggerInstance(res);
        }
        res.on("finish", afterResponse);
        res.on("close", afterResponse);
        next();
      });
    }
    if (NODE_ENV === "development") {
      this.app.use(
        cors({
          credentials: true,
          origin: /^http:\/\/localhost/,
        })
      );
    } else if (NODE_ENV !== "test") {
      this.app.disable("x-powered-by");
      this.app.use(helmet());
      this.app.use(helmet.noSniff());
      this.app.use(helmet.referrerPolicy({ policy: "same-origin" }));
      this.app.use(
        helmet.contentSecurityPolicy({
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "maxcdn.bootstrapcdn.com"],
          },
        })
      );
      const sixtyDaysInSeconds = 15768000;
      this.app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds }));
      this.app.use(cors());
    }
    return;
  }

  _routes() {
    const apiSpec = include("openapi");
    const options = { swaggerOptions: { validatorUrl: null } };
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSpec, options));

    this.app.use(
      middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: false,
      })
    );
    Router.configure(this.app);
    return;
  }
}

module.exports = App;
