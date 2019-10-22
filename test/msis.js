const axios = require('axios');
const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');
const msisService = require('../src/services/msisService');


async function msis(address) {
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

    let responseData = await axios.post(address + '/protocols/msis/init', body);
    responseData = responseData.data;
    const session_token = responseData.session_token; 
    const c = new mcl.Fr();
    c.setStr(responseData.payload.c);

    const gHat = mcl.hashAndMapToG2(X.serializeToHexStr() + c.serializeToHexStr());

    const exponent = mcl.add(x, mcl.mul(a, c));
    const S = mcl.mul(gHat, exponent);

    body = {
        protocol_name: 'msis',
        session_token: session_token,
        payload: {
            S: S.getStr(10).slice(2)
        }
    };

    resp = await axios.post(address + '/protocols/msis/verify', body);
    responseData = resp.data
    assert(responseData.verified);
    console.log(responseData);
}


module.exports = { msis }