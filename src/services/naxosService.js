const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');
const crypto = require('crypto');

function getPublicKey () {
    const publicKey = CONFIG.naxos.pk;
    return mclService.generateG1(`${publicKey.x} ${publicKey.y}`);
}

function getSecretKey () {
    const publicKey = CONFIG.naxos.sk;
    return mclService.generateFr(publicKey);
}

async function exchangeKeys (payload) {
    const g = mclService.getGroupGeneratorG1();
    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    let msg = payload.msg;

    const B = getPublicKey();
    const b = getSecretKey();
    const eskB = utilityService.getRandomBits(512);

    // const h = utilityService.getHashOfValue(eskB + b.getStr());
    
    const hash1 = crypto.createHash('sha3-512')

    const h = hash1.update(eskB + b.getStr()).digest('hex')
    const rInt = BigInt(CONFIG.r);
    const hashInt = BigInt('0x' + h);
    const intValue = (hashInt % rInt).toString();

    const H1 = mclService.generateFr(intValue);
    const Y = mcl.mul(g, H1);

    const AH1 = mcl.mul(A, H1)
    const Xb = mcl.mul(X, b)
    const XH1 = mcl.mul(X, H1)

    const hash2 = crypto.createHash('sha3-512');

    const K = hash2.update(AH1.getStr().slice(2) + Xb.getStr().slice(2) + XH1.getStr().slice(2) + payload.A + B.getStr().slice(2)).digest();

    msg = Buffer.from(msg)
    msg = new Uint8Array(msg)
    const concatenatedArray = new Uint8Array(K.length+msg.length)
    concatenatedArray.set(K)
    concatenatedArray.set(msg, K.length)

    // const hashMessage = utilityService.getHashOfValue(concatenatedArray, 'base64');
    const msgHash = crypto.createHash('sha3-512')

    const hashMessage = msgHash.update(concatenatedArray).digest('base64')

    return {
        Y: Y.getStr().slice(2),
        msg: hashMessage
    }
}


module.exports = { getPublicKey, exchangeKeys }