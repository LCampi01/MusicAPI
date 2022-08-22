const {
    model,
    Schema
} = require('mongoose');

const assign = require('lodash/assign');
const get = require('lodash/get');
const noop = require('lodash/noop');
const size = require('lodash/size');
const values = require('lodash/values');

const CrudServices = include('services/crud');
const CrudController = include('controllers/crud');

const dbHandler = require('./db-handler');

let counter = 5;

const CustomSchema = new Schema({
    _id: Number,
    name: String,
    surname: String,
    foo: String,
    isCopy: Boolean,
    deleted: Boolean,
    deletedAt: Date
}, {collection: 'crud'});

CustomSchema.pre('validate', function(next) {
    const doc = this;
    try {
        if (!/\d+/.test(this._id) || !this._id) {
            doc._id = counter++;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const CustomModel = model('Crud', CustomSchema);

const clearDb = async () => await dbHandler.clearDatabase();

const service = new CrudServices(CustomModel);
const controller = new CrudController(service);

describe('CRUD Controller|Service Unit Test', () => {
    before(async () => {
        await dbHandler.connect();
    });

    afterEach(async () => {
        counter = 6;
        await clearDb();
        await CustomModel.insertMany([
            {
                _id: 1,
                name: 'fake-name-2',
                surname: 'fake-surname-2'
            },
            {
                _id: 2,
                name: 'fake-name-3',
                surname: 'fake-surname-3'
            },
            {
                _id: 3,
                name: 'non-fake-name-1',
                surname: 'non-fake-surname-1'
            },
            {
                _id: 4,
                name: 'non-fake-name-4',
                surname: 'non-fake-surname-4'
            }
        ]);
    });

    after(async () => {
        await dbHandler.closeDatabase();
    });

    it('should return with term key value non', async () => {
        const resultFromCrud = {};
        await controller.fetch(
            {
                query: {term: 'non'},
                params: {}
            },
            {send: result => assign(resultFromCrud, result)},
            noop,
            ['name']
        );

        resultFromCrud.should.have.property('documents').which.is.an.Array();
        resultFromCrud.should.have.property('total').which.is.a.Number();
    });

    it('should return exact param filter', async () => {
        const resultFromCrud = {};
        await controller.fetchOneByParams(
            {params: {name: 'non-fake-name-1'}},
            {send: result => assign(resultFromCrud, result)},
            noop
        );

        resultFromCrud.should.have.property('name').which.is.a.String();
        resultFromCrud.should.have.property('surname').which.is.a.String();

        get(resultFromCrud, 'name').should.be.equal('non-fake-name-1');
        get(resultFromCrud, 'surname').should.be.equal('non-fake-surname-1');
    });

    it('should return exact query filter', async () => {
        const resultFromCrud = {};
        await controller.fetchOneByQuery(
            {query: {name: 'non-fake-name-1'}},
            {send: result => assign(resultFromCrud, result)},
            noop
        );

        resultFromCrud.should.have.property('name').which.is.a.String();
        resultFromCrud.should.have.property('surname').which.is.a.String();

        get(resultFromCrud, 'name').should.be.equal('non-fake-name-1');
        get(resultFromCrud, 'surname').should.be.equal('non-fake-surname-1');
    });

    it('should copy an object with the exact values but different id', async () => {
        const element = await CustomModel.findOne({name: 'non-fake-name-1'}).lean().exec();

        await controller.copy(
            {params: {_id: element._id}},
            {send: noop},
            noop
        );

        const elements = await CustomModel.find({name: 'non-fake-name-1'}).lean().exec();

        get(elements, '0.name').should.be.equal(get(elements, '1.name'));
        get(elements, '0.surname').should.be.equal(get(elements, '1.surname'));
        get(elements, '1.isCopy').should.be.equal(true);
    });

    it('should create an object', async () => {
        const resultFromCrud = {};
        await controller.saveOne(
            {
                params: {},
                body: {
                    name: 'new-fake-value',
                    surname: 'new-fake-surname-value'
                },
                method: 'POST'
            },
            {send: result => assign(resultFromCrud, result._doc)},
            noop
        );

        resultFromCrud.should.have.property('name').which.is.a.String();
        resultFromCrud.should.have.property('surname').which.is.a.String();

        get(resultFromCrud, 'name').should.be.equal('new-fake-value');
        get(resultFromCrud, 'surname').should.be.equal('new-fake-surname-value');
    });

    it('should update an object', async () => {
        const resultFromCrud = {};
        await controller.saveOne(
            {
                params: {_id: 2},
                body: {
                    name: 'new-fake-value',
                    surname: 'new-fake-surname-value'
                },
                method: 'PUT'
            },
            {send: result => assign(resultFromCrud, result)},
            noop
        );

        resultFromCrud.should.have.property('name').which.is.a.String();
        resultFromCrud.should.have.property('surname').which.is.a.String();

        get(resultFromCrud, 'name').should.be.equal('new-fake-value');
        get(resultFromCrud, 'surname').should.be.equal('new-fake-surname-value');
    });

    it('should saveMany objects', async () => {
        const resultFromCrud = {};
        await controller.saveMany(
            {
                params: {},
                body: [{
                    name: 'created-new-fake-value',
                    surname: 'created-new-fake-surname-value'
                }, {
                    _id: 2,
                    name: 'new-fake-value',
                    surname: 'new-fake-surname-value'
                }, {
                    name: 'created-new-fake-value-2',
                    surname: 'created-new-fake-surname-value-2'
                } ]
            },
            {send: result => assign(resultFromCrud, result)},
            noop
        );

        const items = await CustomModel.find({_id: {$in: [2, 6, 7]}}).lean().exec();
        size(items).should.be.equal(3);

        const modifiedItem = get(items, '0');
        modifiedItem.name.should.be.equal('new-fake-value');
        modifiedItem.surname.should.be.equal('new-fake-surname-value');

        const newItem = get(items, '2');
        newItem.name.should.be.equal('created-new-fake-value-2');
        newItem.surname.should.be.equal('created-new-fake-surname-value-2');
    });

    it('should delete an object', async () => {
        const resultFromCrud = {};
        await controller.deleteOne(
            {params: {_id: 2}},
            {send: result => assign(resultFromCrud, result)},
            noop
        );

        const modifiedItem = await CustomModel.findById(2);
        resultFromCrud.should.have.property('name').which.is.a.String();
        resultFromCrud.should.have.property('surname').which.is.a.String();
        resultFromCrud.should.have.property('deleted').which.is.a.Boolean();

        resultFromCrud.deleted.should.be.equal(modifiedItem.deleted);
        resultFromCrud._id.should.be.equal(2);
        modifiedItem._id.should.be.equal(2);

    });

    it('should delete many object', async () => {
        const resultFromCrud = {};
        await controller.deleteMany(
            {body: [{_id: 1}, {_id: 2}]},
            {send: result => assign(resultFromCrud, result)},
            noop
        );

        const modifiedItem = await CustomModel.find({deleted: true}).lean().exec();
        JSON.stringify(modifiedItem).should.be.equal(JSON.stringify(values(resultFromCrud)));
    });
});
