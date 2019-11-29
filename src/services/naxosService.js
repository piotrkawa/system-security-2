const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');


function getPublicKey () {
    const publicKey = CONFIG.naxos.pk;
    return mclService.generateG1(`${publicKey.x} ${publicKey.y}`);
}

function getSecretKey () {
    const publicKey = CONFIG.naxos.sk;
    return mclService.generateFr(publicKey);
}

async function exchangeKeys (payload) {
    const g = getGroupGenerator()
    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);

    const B = getPublicKey();
    const b = getSecretKey();
    const eskB = utilityService.getRandomBits(512); // TODO: bytes or bits ???

    

    return false;
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, getPublicKey, verifySignature }