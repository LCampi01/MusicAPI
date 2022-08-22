const every = require('lodash/every');
const concat = require('lodash/concat');
const mongoose = require('mongoose');

const pkg = root_path('package.json');

/**
 * Creates the status object
 * @param {Array<{status}>} deps Required dependencies to work.
 * @param {Array<{status}>} optionalDeps Optional dependencies to work.
 * @returns {{name, status: string, deps}} Returns the status of this app.
 */
const generateStatus = (deps, optionalDeps = []) => ({
    deps: concat(deps, optionalDeps),
    name: pkg.name,
    status: every(deps, ({status: 'up'})) ? (every(optionalDeps, ({status: 'up'})) ? 'up' : 'degraded') : 'down'
});

class StatusService {
    static getStatus() {
        return generateStatus([StatusService.getMongoDBStatus()]);
    }

    static getHealth() {
        return StatusService.getMongoDBStatus();
    }

    static getMongoDBStatus() {
        return {
            name: 'MongoDB',
            status: mongoose.connection.readyState === 1 ? 'up' : 'down'
        };
    }
}

module.exports = StatusService;
