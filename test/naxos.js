const axios = require('axios');
const assert = require('assert');
// const mcl = require('mcl-wasm');

const { CONFIG, mcl } = require('../config');
const mclService = require('../src/services/mclService');
const utilityService = require('../src/services/utilityService');


async function naxos(address, HTTPMethods) { 
    const { sendGETRequest, sendPOSTRequest } = HTTPMethods;

    await mcl.init(CONFIG['CURVE_TYPE']);


    const g = mclService.getGroupGeneratorG1();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);

    const eskA = utilityService.getRandomBits(512);
    
    let response = await sendGETRequest(`${address}/protocols/naxos/pkey`);
    const B = mclService.generateG1(response.data.B);

    let message = 'THIS IS MY MESSAGE';

    const H1 = utilityService.getHashOfValue(eskA + a.getStr());
    const X = mcl.mul(g, H1);

    let body = {
        protocol_name: "naxos",
        payload: {
            X: X.getStr().slice(2),
            A: A.getStr().slice(2),
            msg: message
        }
    };

    response = await sendPOSTRequest(`${address}/protocols/naxos/exchange`, body);

    const Y = mclService.generateG1(responseData.data.Y);
    const msg = response.data.msg;
    
    const Ya = mcl.mul(Y, a);
    const BH1 = mcl.mul(B, H1);
    const YH1 = mcl.mul(Y, H1);


    let K = utilityService.getHashOfValue(Ya.getStr().slice(2) + BH1.getStr().slice(2) + YH1.getStr().slice(2) + A.getStr().slice(2) + BStr);
    K = new Uint8Array(K);

    message = Buffer.from(message)
    message = new Uint8Array(message)
    const concatenatedArray = new Uint8Array(K.length+message.length)
    concatenatedArray.set(K)
    concatenatedArray.set(message, K.length)

    const msgg = utilityService.getHashOfValue(concatenatedArray, 'base64');

    assert(msg === msgg);

}

module.exports = { naxos } 