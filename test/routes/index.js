process.env.MONGOMS_DEBUG=1;
const get = require('lodash/get');
const Sinon = require('sinon');

const Logger = include('helpers/logger');
Sinon.stub(Logger, 'info').returns('');

const App = new (include('app'))();

App.test();
const {app} = App;
const request = require('supertest')(app);

const getWrappingErrors = error => {
    return get(error, 'assertion.params.actual.errors');
};

module.exports = {
    request,
    Sinon,
    getWrappingErrors
};
