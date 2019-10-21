const uuidv4 = require('uuid/v4');
const { SHA3 } = require('sha3');


function generateToken () {
    const token = uuidv4();
    return token;
}

function getHashOfValue(value) {
    const hash = SHA3(512);
    hash.update(value);
    return hash.digest('hex');
}

module.exports = { generateToken, getHashOfValue}
