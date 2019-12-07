const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');
const crypto = require('crypto');
const sssService = require('./sssService');
const dbService = require('./dbService');


function generateKey(value) {
    const hash = crypto.createHash('sha3-256');
    return hash.update(value).digest();
}

async function init(payload) {
    const X = payload.X;

    const y = mclService.getRandomScalar();
    const g = mclService.getGroupGeneratorG1();
    const Y = mcl.mul(g, y);

    const gxy = mcl.mul(X, Y).getStr().slice(2);
    const B = mclService.getPublicKey();
    const BStr = B.getStr().slice(2);
    
    const hmacKey = generateKey('mac_' + gxy);
    const hmac =  chacha.createHmac(hmacKey);
    const BMAC = hmac.update(BStr).digest()
    
    const message = X.getStr().slice(2) + Y.getStr().slice(2);

    const sessionToken = utilityService.generateToken();
    const informationToSave = {
        X: X, 
        Y: Y,
        y: y,
        hmacKey: hmacKey
    };

    await dbService.saveSession(sessionToken, informationToSave);
    // X, Y, y, hmacKey

    const response = {
        payload: {
            b_mac: BMAC,
            B: B.getStr().slice(2),
            Y: Y.getStr().slice(2),
            sig: sssService.generateSignature(message, mclService.getSecretKey()),
        },
        session_token: sessionToken
    };
    return response;
}

async function exchangeKeys (dbValues, payload) {
    const { X, Y, y, hmacKey } = dbValues;
    const { a_mac, A, msg, sig } = payload;

    const sigX = sig['A']
    const s = sig['s']
    const sigMsg = sig['msg'];

    
    // verify HMAC
    
    
    
    // verify signature

    assert(sssService.verifySignature());

    const gxy = mcl.mul(X, Y).getStr().slice(2);
    const sessionKey = generateKey('session_' + gxy);


    // sessionKey + msg

    const msgHash1 = crypto.createHash('sha3-512');
    const encryptedMessage = msgHash1.update(concatenatedArray).digest('base64')


    return {
        msg: encryptedMessage
    }
}


module.exports = { exchangeKeys, init }