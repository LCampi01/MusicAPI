/* eslint-disable no-console */
const path = require('path');

require('dotenv').config({path: path.resolve(__dirname, '../..', '.env')});

const mongoose_migration = require('mongoose');
const fs = require('fs');

require(path.resolve(__dirname, '../..', 'src/global'));

include('helpers/mongoose').configure();

(async () => {
    mongoose_migration.Promise = global.Promise;
    const db = await mongoose_migration.createConnection(process.env.MIGRATION_MONGO_URL, {});

    console.log('Migration DB connected...');
    const filesInDir = fs.readdirSync(__dirname);
    // eslint-disable-next-line lodash/prefer-lodash-method
    const files = filesInDir.filter(f => !f.includes('index'));
    for (const file of files) {
        const didMigrate = await db.collection('migration').findOne({name: file});
        if (!didMigrate) {
            try {
                const toMigrate = require(`${__dirname}/${file}`);
                if (toMigrate['up'] !== undefined) {
                    console.log(`Working file ${file}`);
                    await toMigrate.up();
                    await db.collection('migration').insertOne({
                        name: file,
                        status: 'up',
                        created: new Date()
                    });
                }

                if (toMigrate['down'] !== undefined) {
                    console.log(`Working file ${file}`);
                    await toMigrate.down();
                    await db.collection('migration').insertOne({
                        name: file,
                        status: 'down',
                        created: new Date()
                    });
                }
            } catch (err) {
                console.error(`Migration failed ${err.message}`);
            }
        }
    }
    mongoose_migration.connection.on('close', () => console.log('connection closed'));
    mongoose_migration.connection.on('error', err => {
        console.error(`connection error ${err}`);
    });
    mongoose_migration.connection.close();
    console.log('Migration finished');
    process.exit();
})();
