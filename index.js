require('dotenv').config({path: process.env.NODE_ENV === 'test' ? './test/.env' : `${__dirname}/.env`});
require('./src/global');

if (process.env.NODE_ENV !== 'test') {
    require('./src');
}
