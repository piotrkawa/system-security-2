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
    const g = getGroupGenerator();
    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    let msg = payload.msg;

    const B = getPublicKey();
    const b = getSecretKey();
    const eskB = utilityService.getRandomBits(512);

    const h = utilityService.getHashOfValue(eskB + b.getStr());

    const H1 = mclService.generateFr(h);
    const Y = mcl.mul(g, H1);

    const AH1 = mcl.mul(A, H1)
    const Xb = mcl.mul(X, b)
    const XH1 = mcl.mul(X, H1)

    const K = utilityService.getHashOfValue(AH1.getStr().slice(2) + Xb.getStr().slice(2) + XH1.getStr().slice(2) + AStr + B.getStr().slice(2));

    msg = Buffer.from(msg)
    msg = new Uint8Array(msg)
    const concatenatedArray = new Uint8Array(K.length+msg.length)
    concatenatedArray.set(K)
    concatenatedArray.set(msg, K.length)

    const hashMessage = utilityService.getHashOfValue('sha3-512', 'base64');

    return {
        Y: Y.getStr().slice(2),
        msg: hashMessage
    }
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, getPublicKey, verifySignature }