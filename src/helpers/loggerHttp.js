const logger = require('./logger');

exports.loggerInstance = res => {
    const {
        statusCode, statusMessage, req: {
            method, originalUrl
        }
    } = res;
    if (statusCode >= 500) {
        return logger.error(`${statusCode} ${method} ${originalUrl}, message ${statusMessage}`);
    }
    return logger.debug(`${statusCode} ${method} ${originalUrl}, message ${statusMessage}`);
};

exports.logResponse = function (id, body, statusCode) {
    const log = this.loggerInstance.child({
        id,
        body,
        statusCode
    }, true);
    log.info('response');
};
