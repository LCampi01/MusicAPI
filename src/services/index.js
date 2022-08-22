const fs = require('fs');
const upperFirst = require('lodash/upperFirst');
const includes = require('lodash/includes');
const reduce = require('lodash/reduce');

const services = reduce(fs.readdirSync(__dirname), (servicesObj, filename) => {
    if (!includes(filename, 'index.js')) {
        // eslint-disable-next-line lodash/prefer-lodash-method
        servicesObj[`${upperFirst(filename.replace('.js', ''))}Services`] = include(`services/${filename}`);
    }
    return servicesObj;
}, {});

module.exports = services;
