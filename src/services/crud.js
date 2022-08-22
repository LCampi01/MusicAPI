'use strict';
const ceil = require('lodash/ceil');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const toNumber = require('lodash/toNumber');

module.exports = class Common {
    constructor(model) {
        /**
         * @var {mongoose.model}
         */
        this._model = model;
        this.fetch = this.fetch.bind(this);
        this.getPagination = this.getPagination.bind(this);
        this.fetchOne = this.fetchOne.bind(this);
        this.saveOne = this.saveOne.bind(this);
        this.saveMany = this.saveMany.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.copy = this.copy.bind(this);
    }

    /**
     * Filters to find the wanted results
     * it will return an array of objects
     * @param {Object} filters
     * @returns {Array<Object>}
     */
    fetch(filters, skip, size, sort, project) {

        const find = this._model.find(filters, project);

    if (skip !== undefined) {
        find.skip(skip * size || 0).limit(size);
    }

    return find.sort(sort || {_id: 1})
        .lean()
        .exec();
    }

    async getPagination(filters, size) {
        /**
         * @type {mongoose.model}
         */
        const total = await this._model.countDocuments(filters).exec();
        return {
            total,
            size: ceil(total / size)
        };
    }

    /**
     * Filters to find the wanted result
     * it will return only one result
     * @param {Object} filters
     * @returns {Object}
     */
    fetchOne(filters) {
        return this._model.findOne(filters).lean().exec();
    }

    async copy({_id}) {
        const previous = await this._model.findById(toNumber(_id)).lean().exec();
        if (previous) {
            delete previous._id;
            previous.isCopy = true;
            return this._model.create(previous);
        }
    }

    /**
     * params to find the object to be updated
     * object the values of the objects to update
     * will create by default if object its undefined
     * return false if fail, object that where update on success
     * @param {Object} params
     * @param {Object} object
     * @returns {Bool|Object}
     */
    async saveOne(params, object) {
        if (isEmpty(params)) {
            return this._model.create(object);
        }

        await this._model
            .updateOne(params || { _id: object._id }, {
                ...object,
                $inc: {__v: 1}
            }, { upsert: true })
            .lean()
            .exec();

        return this._model.findOne(params || { _id: object._id }).lean().exec();
    }

    /**
     * object the values of the objects to update
     * will create by default if object its undefined
     * return false if fail, array of object that where updated on success
     * @param {Array<Object>} objects
     * @returns {Bool|Object}
     */
    saveMany(objects) {
        return Promise.all(
            map(objects, obj => {
                if (obj._id) {
                    const {_id} = obj;
                    delete obj._id;
                    return this._model
                        .updateOne({_id}, {
                            ...obj,
                            $inc: {__v: 1}
                        }, { upsert: true })
                        .lean()
                        .exec();
                }
                return this._model.create(obj);
            })
        );
    }

    /**
     * params to find the object to be deleted
     * return boolean
     * @param {Object} params
     * @returns {Bool}
     */
    async deleteOne({_id}) {
        await this._model.updateOne({_id}, {
            deleted: true,
            deletedAt: new Date()
        }).lean().exec();
        return this._model.findById(_id).lean().exec();
    }

    /**
     * objects to be deleted
     * return array of boolean
     * @param {Array<Object>} objects
     * @returns {Array<Bool>}
     */
    async deleteMany(objects) {
        const ids = map(objects, obj => obj._id);
        await this._model.updateMany({_id: {$in: ids}}, {
            deleted: true,
            deletedAt: new Date()
        }).lean().exec();
        return this._model.find({_id: ids}).lean().exec();
    }
};
