require('./global');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cluster = require('cluster');
const { spawn } = require('child_process');

const forEach = require('lodash/forEach');

const nativeEvent = require('./helpers/nativeEvent');

const executeMigrations = () => {
    if (process.env.MONGO_URL) {
        const out = fs.openSync('executions.log', 'a');
        const err = fs.openSync('executions.log', 'a');

        const subprocess = spawn(process.argv[0], [path.resolve(__dirname, '..', 'db/migrations/index.js')], {
            detached: true,
            stdio: [ 'ignore', out, err ]
        });

        subprocess.unref();
    }
};

const appInit = () => {
    const App = require('./app');
    const app = new App();
    if (process.env.NODE_ENV === 'production') {
        if (cluster.isMaster) {
            nativeEvent.process();
            const CPUS = os.cpus();
            forEach(CPUS, () => cluster.fork());
            nativeEvent.cluster(cluster);
            executeMigrations();
        } else {
            app.init();
        }
    } else {
        app.init();
        executeMigrations();
    }
};

appInit();
