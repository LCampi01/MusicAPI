/* eslint-disable lodash/collection-method-value, lodash/prefer-map */
const flattenDepth = require('lodash/flattenDepth');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isPlainObject = require('lodash/isPlainObject');
const isString = require('lodash/isString');
const join = require('lodash/join');
const map = require('lodash/map');
const pick = require('lodash/pick');
const reduce = require('lodash/reduce');
const values = require('lodash/values');
const filter = require('lodash/filter');

const reducedList = (array, filterKey, keyData) => reduce(array, (objectsByKeyValue, obj) => {
    const value = join(values(pick(obj, filterKey)), '');
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat({
        name: get(obj, keyData),
        _id: get(obj, keyData)
    });
    return objectsByKeyValue;
}, {});

const flatDeepText = object => {
    const newValues = flattenDepth(map(object, o => values(o)), 3);
    const objects = filter(newValues, v => isPlainObject(v));
    const texts = filter(newValues, v => isString(v));
    let subFilter = [];
    if (!isEmpty(objects)) {
        subFilter = flatDeepText(objects);
    }
    return [...subFilter, ...texts];
};

module.exports = {
    flatDeepText,
    reducedList
};
