const axios = require('axios');
const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');
const sssService = require('../src/services/sssService');


async function sss(address) {
    await mcl.init(CONFIG['CURVE_TYPE']);
    
    const msg = "MY MESSAGE";

    const g = sssService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);
    const x = mclService.getRandomScalar();
    const X = mcl.mul(g, x);
    const c = sssService.computeC(msg, X);
    const s = mcl.add(x, mcl.mul(a, c));

    let body = {
        protocol_name: 'sss',
        payload: {
            s: s.getStr(10),
            X: X.getStr(10).slice(2),
            A: A.getStr(10).slice(2),
            msg: msg
        }
    };
    let responseData = await axios.post(address + '/salsa/protocols/sss/verify', body);
    // let responseData = await axios.post(address + '/salsa/protocols/sss/verify', body);
    responseData = responseData.data;
    assert(responseData.valid);
    console.log(responseData.data);
}


module.exports = { sss }