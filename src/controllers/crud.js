'use strict';
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const keys = require('lodash/keys');
const map = require('lodash/map');
const replace = require('lodash/replace');
const split = require('lodash/split');

class CommonController {
    constructor(service) {
        this._service = service;
        this.fetch = this.fetch.bind(this);
        this.fetchOneByParams = this.fetchOneByParams.bind(this);
        this.fetchOneByQuery = this.fetchOneByQuery.bind(this);
        this.saveOne = this.saveOne.bind(this);
        this.saveMany = this.saveMany.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.copy = this.copy.bind(this);
    }

    /**
     * Fetch all occurrence of current service
     * also fetch by filters if there is one
     * @param {Array} termKeys
     */
    async fetch(req, res, next, termKeys) {
        let filters = {deleted: {$ne: true}};
        const {
            term,
            skip,
            size,
            start,
            end,
            sort,
            ids,
            fields,
            customFields,
            ...query
        } = req.query;

        const sortFixed = {};
        forEach(keys(sort), keyFrom => {
            sortFixed[replace(keyFrom, 'Order', '')] = get(sort, keyFrom);
        });

        if (term && termKeys) {
            let newWord = '';
            // Fixing accents in term search
            forEach(split(term, ''), word => {
                switch (word) {
                    case 'a':
                    case 'á':
                        newWord += '[aá]';
                        break;
                    case 'e':
                    case 'é':
                        newWord += '[eé]';
                        break;
                    case 'i':
                    case 'í':
                        newWord += '[ií]';
                        break;
                    case 'o':
                    case 'ó':
                        newWord += '[oó]';
                        break;
                    case 'u':
                    case 'ú':
                        newWord += '[uú]';
                        break;
                    default:
                        newWord += word;
                }
            });
            const regexp = new RegExp(newWord, 'i');
            filters.$or = map(termKeys, terms => ({ [terms]: regexp }));
        }


        if (ids) {
            filters._id = {$in: ids};
        }

        if (customFields) {
            const result = objectToPathString(customFields, 'customFields');
            filters = {
                ...filters,
                ...result
            };
        }

        if (query) {
            filters = {
                ...filters,
                ...query
            };
        }

        if (req.params) {
            filters = {
                ...filters,
                ...req.params
            };
        }

        const project = {};

        if (fields) {
            forEach(fields, field => (project[field] = 1));
        }

        try {
            const documents = await this._service.fetch(
                filters,
                skip,
                size,
                sortFixed,
                project
            );
            const response = await this._service.getPagination(filters, size);
            res.send({
                documents,
                ...response
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Params that where passed using express
     * will send the first occurrence that match the params
     */
    async fetchOneByParams(req, res, next) {
        try {
            const result = await this._service.fetchOne(req.params);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Query that where passed using express
     * will send the first occurrence that match the query
     */
    async fetchOneByQuery(req, res, next) {
        try {
            const result = await this._service.fetchOne(req.query);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    async copy(req, res, next) {
        try {
            const result = await this._service.copy(req.params);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    async saveOne(req, res, next) {
        try {
            const result = await this._service.saveOne(req.params, req.body, req.method);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    async saveMany(req, res, next) {
        try {
            const result = await this._service.saveMany(req.body);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    async deleteOne(req, res, next) {
        try {
            const result = await this._service.deleteOne(req.params);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    async deleteMany(req, res, next) {
        try {
            const result = await this._service.deleteMany(req.body);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CommonController;
