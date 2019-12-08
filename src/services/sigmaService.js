const chacha = require('chacha');
const assert = require('assert');
const crypto = require('crypto');

const { mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');
const sssService = require('./sssService');
const dbService = require('./dbService');


function generateKey(value) {
    const hash = crypto.createHash('sha3-256');
    return hash.update(value).digest();
}

async function init(payload) {
    const X = mclService.generateG1(payload.X);

    const y = mclService.getRandomScalar();
    const g = mclService.getGroupGeneratorG1();
    const Y = mcl.mul(g, y);

    const gxy = mcl.mul(X, y);
    const B = mclService.getPublicKey();
    const BStr = B.getStr().slice(2);

    const hmacKey = generateKey('mac_' + gxy.getStr().slice(2));
    const hmac = chacha.createHmac(hmacKey);
    const BMAC = hmac.update(BStr).digest('base64');

    const message = X.getStr().slice(2) + Y.getStr().slice(2);
    const sessionToken = utilityService.generateToken();

    const informationToSave = {
        X: X.getStr().slice(2),
        Y: Y.getStr().slice(2),
        y: y.getStr()
    };

    await dbService.saveSession(sessionToken, informationToSave);

    const sigResult = sssService.generateSignature(message, mclService.getSecretKey());

    const response = {
        payload: {
            b_mac: BMAC,
            B: B.getStr().slice(2),
            Y: Y.getStr().slice(2),
            sig: {
                X: sigResult['A'],
                s: sigResult['s'],
                msg: sigResult['msg']
            }
        },
        session_token: sessionToken
    };
    return response;
}

function exchangeKeys(dbValues, payload) {
    const { X, Y, y } = dbValues;
    let { a_mac, A, msg, sig } = payload;

    const sigX = sig['X'];
    const s = sig['s'];
    const sigMsg = sig['msg'];

    // verify HMAC
    const gxy = mcl.mul(mclService.generateG1(X), mclService.generateFr(y));
    const hmacKey = generateKey('mac_' + gxy.getStr().slice(2));

    const hmac = chacha.createHmac(hmacKey);
    const generatedMac = hmac.update(A).digest('base64');
    assert(a_mac === generatedMac);

    // verify signature
    assert(sssService.verifySignature({ A: A, X: sigX, s: s }));

    // generate key
    const sessionKey = generateKey('session_' + gxy.getStr().slice(2));
    msg = Buffer.from(msg);
    msg = new Uint8Array(msg);
    const concatenatedArray = new Uint8Array(sessionKey.length + msg.length);
    concatenatedArray.set(sessionKey);
    concatenatedArray.set(msg, sessionKey.length);

    const hashSHA3512 = crypto.createHash('sha3-512');
    const encryptedMessage = hashSHA3512.update(concatenatedArray).digest('base64');

    return {
        msg: encryptedMessage
    }
}

module.exports = { init, exchangeKeys }