const uuidv4 = require('uuid/v4');

function generateToken() {
    const token = uuidv4();
    return token;
}

module.exports = { generateToken }