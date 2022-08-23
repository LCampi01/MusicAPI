const CrudController = require("./crud");
const { TrackServices: service } = include("services");

const logger = require("../helpers/logger");

const client = require("./redis-client");
class TrackController extends CrudController {
  constructor() {
    super(service);
    this.generateToken = this.generateToken.bind(this);
    this.createTrack = this.createTrack.bind(this);
    this.deleteTrack = this.deleteTrack.bind(this);
    this.modifyTrack = this.modifyTrack.bind(this);
    this.getTracks = this.getTracks.bind(this);
    this.getTrack = this.getTrack.bind(this);
  }

  async generateToken(req, res) {
    try {
      const result = await this._service.generateToken(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async createTrack(req, res) {
    try {
      const result = await this._service.createTrack(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteTrack(req, res) {
    try {
      const result = await this._service.deleteTrack(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async modifyTrack(req, res) {
    try {
      const result = await this._service.modifyTrack(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async getTracks(req, res) {
    try {
      await client.connect();
      await client.get("tracks", async (err, reply) => {
        if (reply) {
          return res.send(JSON.parse(reply));
        } else {
          const result = await this._service.getTracks(req.body);
          client.set("tracks", JSON.stringify(result), (err, reply) => {
            if (err) res.send({ error: err });

            res.send(result);
          });
        }
      });
    } catch (err) {
      logger.error(err);
    }
  }

  async getTrack(req, res) {
    try {
      await client.connect();
      await client.get(`track-${req.body.code}`, async (err, reply) => {
        if (reply) {
          return res.send(JSON.parse(reply));
        } else {
          const result = await this._service.getTrack(req.body);
          client.set(`track-${req.body.code}`, JSON.stringify(result), (err, reply) => {
            if (err) res.send({ error: err });
            res.send(result);
          });
        }
      });
    } catch (err) {
      logger.error(err);
    }
  }
}

module.exports = new TrackController();
