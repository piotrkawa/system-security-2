const mcl = require('mcl-wasm');
const assert = require('assert');

const CONFIG = require('../config').CONFIG;
const mclService = require('../src/services/mclService');
const oisService = require('../src/services/oisService');
const sssService = require('../src/services/sssService');
const msisService = require('../src/services/msisService');
const utilityService = require('../src/services/utilityService');


async function manualMSIS() {
    await mcl.init(CONFIG.CURVE_TYPE);

    const g = msisService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);

    const x = mclService.getRandomScalar();
    const X = mcl.mul(g, x);

    const c = mclService.getRandomScalar();

    const gHat = mcl.hashAndMapToG2(X.serializeToHexStr() + c.serializeToHexStr());
    
    const exponent = mcl.add(x, mcl.mul(a, c));
    const S = mcl.mul(gHat, exponent);
    
    // body = {
    //     protocol_name: 'msis',
    //     session_token: session_token,
    //     payload: {
    //         S: S.getStr(10).slice(2)
    //     }
    // };

    console.log('################## verify body ##################');
    console.log(body);

    resp = await instance.post(ROOT + '/protocols/msis/verify', body);
    responseData = resp.data
    console.log('################## verify response ##################');
    assert(responseData.verified);

}

manualMSIS()


