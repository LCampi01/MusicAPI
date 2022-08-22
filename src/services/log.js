const mongoose = require('mongoose');

const {Schema} = mongoose;

const SchemaModel = new Schema({
    user: {type: Object},
    route: {
        type: String,
        required: true
    },
    params: {
        type: Object,
        required: true
    }
}, {
    timestamps: true,
    collection: 'logs'
});

exports.register = async data => {
    mongoose.Promise = global.Promise;
    const db = await mongoose.createConnection(process.env.LOGGER_MONGO_URL, {});

    const Model = db.model('Logs', SchemaModel);

    return Model.create(data);
};
