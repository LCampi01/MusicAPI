const bcrypt = require('bcryptjs');

const encrypt = (string, salt = 10) => bcrypt.hashSync(string, salt);
const compare = (string, hash) => bcrypt.compareSync(string, hash);

module.exports = {
    encrypt,
    compare
};
