const crypto = require('crypto');
const split = require('lodash/split');
const times = require('lodash/times');
const bcrypt = require('bcryptjs');

const cryptoConfig = JSON.parse(process.env.crypto);

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    times(length, () => {
        result += chars[Math.floor(Math.random() * chars.length)];
    });
    return result;
}

exports.generateFromContent = function generateFromContent(options) {
    options = options || {};
    const hash = crypto.createHash('sha256');
    const content = options.content;
    let text = '';
    hash.update(content);
    text += [content, hash.digest('base64')].join('|');
    return Buffer.from(text).toString('base64');
};

exports.generateFromEmail = function generateFromEmail(options) {
    options = options || {};

    const hash = crypto.createHash('sha256');
    const expires = options.expires;
    const email = options.email || '';
    const secret = options.secret;

    let text = '';

    hash.update(String(expires));
    if (email) {
        hash.update(email.toLocaleLowerCase());
    }
    hash.update(String(secret));

    text += [expires, email, hash.digest('base64')].join('|');
    return Buffer.from(text).toString('base64');
};

exports.resetToken = {
    generateHash: function generateHash(options) {
        options = options || {};

        const hash = crypto.createHash('sha256');
        const expires = options.expires;
        const email = options.email;
        const dbHash = options.dbHash;
        const password = options.password;
        let text = '';

        hash.update(String(expires));
        hash.update(email.toLocaleLowerCase());
        hash.update(password);
        hash.update(String(dbHash));

        text += [expires, email, hash.digest('base64')].join('|');
        return Buffer.from(text).toString('base64');
    },
    extract: function extract(options) {
        options = options || {};

        const token = options.token;
        const tokenText = Buffer.from(token, 'base64').toString('ascii');

        const parts = split(tokenText, '|');

        // Check if invalid structure
        if (!parts || parts.length !== 3) {
            return false;
        }

        const expires = parseInt(parts[0], 10);
        const email = parts[1];

        return {
            expires,
            email
        };
    },
    compare: function compare(options) {
        options = options || {};

        const tokenToCompare = options.token;
        const parts = exports.resetToken.extract({token: tokenToCompare});
        const dbHash = options.dbHash;
        const password = options.password;
        let diff = 0;
        let i;

        if (isNaN(parts.expires)) {
            return {
                correct: false,
                reason: 'invalid_expiry'
            };
        }

        // Check if token is expired to prevent replay attacks
        if (parts.expires < Date.now()) {
            return {
                correct: false,
                reason: 'expired'
            };
        }

        const generatedToken = exports.resetToken.generateHash({
            email: parts.email,
            expires: parts.expires,
            dbHash: dbHash,
            password: password
        });

        if (tokenToCompare.length !== generatedToken.length) {
            diff = 1;
        }

        for (i = tokenToCompare.length - 1; i >= 0; i = i - 1) {
            diff |= tokenToCompare.charCodeAt(i) ^ generatedToken.charCodeAt(i);
        }

        const result = {correct: (diff === 0)};

        if (!result.correct) {
            result.reason = 'invalid';
        }

        return result;
    }
};

module.exports = {
    hash: input => {
        return bcrypt.hash(input, 10);
    },
    compare: (input, hash) => bcrypt.compare(input, hash),
    encrypt: input => {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptoConfig.key), cryptoConfig.iv);
        let encrypted = cipher.update(input);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    },
    decrypt: input => {
        const encryptedText = Buffer.from(input, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptoConfig.key), cryptoConfig.iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    randomString: (length = 12) => randomString(length)
};
