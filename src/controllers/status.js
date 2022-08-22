const {StatusServices} = require('../services');
const pkg = require('../../package');

class StatusController {
    static ping(req, res, next) {
        try {
            res.send({version: pkg.version});
        } catch (err) {
            next(err);
        }
    }

    static getStatus(req, res, next) {
        try {
            res.send(StatusServices.getStatus());
        } catch (err) {
            next(err);
        }
    }

    static async getHealth(req, res, next) {
        try {
            const status = await StatusServices.getHealth();
            res.send(status);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = StatusController;
