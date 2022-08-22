const parameters = require('./parameters');
const schemas = require('./schemas');

module.exports = {
    parameters,
    schemas,
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
};
