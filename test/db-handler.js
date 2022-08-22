const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    const instance = await MongoMemoryServer.create();
    const instance2 = await MongoMemoryServer.create();
    const instance3 = await MongoMemoryServer.create();
    global.__MONGOINSTANCE = instance;
    global.__MONGOINSTANCE2 = instance2;
    global.__MONGOINSTANCE3 = instance3;
    if (!process.env.MONGO_URL) {
        const uri = global.__MONGOINSTANCE.getUri();
        const uri2 = global.__MONGOINSTANCE2.getUri();
        const uri3 = global.__MONGOINSTANCE3.getUri();
        process.env.MONGO_URL = uri.slice(0, uri.lastIndexOf('/'));
        process.env.MIGRATION_MONGO_URL = uri2.slice(0, uri2.lastIndexOf('/'));
        process.env.LOGGER_MONGO_URL = uri3.slice(0, uri3.lastIndexOf('/'));
    }

    // The following is to make sure the database is clean before an test starts
    await mongoose.connect(process.env.MONGO_URL, { });
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    const instance = global.__MONGOINSTANCE;
    const instance2 = global.__MONGOINSTANCE2;
    const instance3 = global.__MONGOINSTANCE3;

    await this.clearDatabase();
    await instance.stop();
    await instance2.stop();
    await instance3.stop();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        if (key !== 'admin') {
            const collection = collections[key];
            await collection.drop();
        }
    }
};
