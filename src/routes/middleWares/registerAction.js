const LogsService = require('../../services/log');
const Logger = require('../../helpers/logger');

module.exports = async (req, res, next) => {
    try {
        const {
            user,
            method
        } = req;
        const route = req.get('host') + req.originalUrl;
        const params = {
            method,
            ...req.params,
            ...req.body,
            ...req.fields
        };
        delete params.file;
        await LogsService.register({
            route,
            user,
            params
        });
        return next();
    } catch (err) {
        Logger.error(`control, ${JSON.stringify(err.message)}`);
        return res.sendStatus(401);
    }
};
