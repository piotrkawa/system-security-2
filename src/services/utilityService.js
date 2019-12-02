const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const { CONFIG }= require('../../config');


function generateToken () {
    const token = uuidv4();
    return token;
}

function getHashOfValue(value, format='hex') {
    const hash = crypto.createHash('sha3-512');
    const digestedHash = hash.update(value).digest(format);
    const q = BigInt(CONFIG.r);
    const hashInt = BigInt('0x' + digestedHash);
    return (hashInt % q).toString();
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
