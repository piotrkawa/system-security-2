const axios = require('axios');
const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');
const blsssService = require('../src/services/blsssService');


async function blsss(address) {
    await mcl.init(CONFIG['CURVE_TYPE']);

    const msg = "MY MESSAGE";

    const g = blsssService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);

    const h = mcl.hashAndMapToG2(msg);
    const sigma = mcl.mul(h, a);

    let body = {
        protocol_name: 'blsss',
        payload: {
            sigma: sigma.getStr(10).slice(2),
            A: A.getStr(10).slice(2),
            msg: msg
        }
    };

    let responseData = await axios.post(address + '/protocols/blsss/verify', body);
    responseData = responseData.data;
    console.log(responseData);
    assert(responseData.valid);
}


module.exports = { blsss }