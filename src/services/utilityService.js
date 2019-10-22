const uuidv4 = require('uuid/v4');
// const { SHA3 } = require('sha3');
const crypto = require('crypto');


function generateToken () {
    const token = uuidv4();
    return token;
}

function getHashOfValue(value) {
    const hash = crypto.createHash('sha3-512');
    hash.update(value);
    return hash.digest('hex');
}

module.exports = { generateToken, getHashOfValue}
