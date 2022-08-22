const jwt = require('jsonwebtoken');

const get = require('lodash/get');

const {
    TOKEN_LIFETIME, TOKEN_APP_LIFETIME
} = process.env;

exports.generateToken = (user, secret) => new Promise(resolve => {
    const token = jwt.sign({ user },
        secret,
        {expiresIn: TOKEN_LIFETIME || '7d'}
    );
    resolve(token);
});

exports.validateToken = (token, secret) => new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return reject(err);
        }
        return resolve(get(decoded, 'user'));
    });
});

exports.decodeToken = token => new Promise(resolve => {
    const decoded = jwt.decode(token);
    return resolve(decoded);
});

exports.generateAppToken = (user, secret) => new Promise(resolve => {
    delete user.jwtSign;
    const token = jwt.sign(
        { user },
        secret,
        {expiresIn: TOKEN_APP_LIFETIME || '99y'}
    );
    resolve(token);
});
