const uuidv4 = require('uuid/v4');
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


function getRandomBits(numberOfBits) {
    let bits = "";
    for (i=0; i<numberOfBits; i++) {
        let randomBit = randomInt(0, 1);
        bits += randomBit;
    }
    return bits;
}


function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = { generateToken, getHashOfValue, getRandomBits }
