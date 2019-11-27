const axios = require('axios');
const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');
const msisService = require('../src/services/msisService');


async function msis(address, sendRequest) {
    await mcl.init(CONFIG['CURVE_TYPE']);

    const g = msisService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);

    const x = mclService.getRandomScalar();
    const X = mcl.mul(g, x);

    let body = {
        protocol_name: 'msis',
        payload: {
            A: A.getStr(10).slice(2),
            X: X.getStr(10).slice(2)
        }
    };

    let response = await sendRequest(`${address}/protocols/msis/init`, body);
    let responseData = response.data;
    const session_token = responseData.session_token; 
    const c = new mcl.Fr();
    c.setStr(responseData.payload.c);

    const gHat = mcl.hashAndMapToG2(X.getStr(10).slice(2) + c.getStr(10));

    const exponent = mcl.add(x, mcl.mul(a, c));
    const S = mcl.mul(gHat, exponent);

    body = {
        protocol_name: 'msis',
        session_token: session_token,
        payload: {
            S: S.getStr(10).slice(2)
        }
    };

    response = await sendRequest(`${address}/protocols/msis/verify`, body);
    responseData = response.data
    assert(responseData.verified);
}


module.exports = { msis }