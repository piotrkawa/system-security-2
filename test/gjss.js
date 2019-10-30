const axios = require('axios');
const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');
const utilityService = require('../src/services/utilityService');
const gjssService = require('../src/services/gjssService');

const s_k = CONFIG.gjss.s_k; // TODO: can be prettier


async function gjss(address) { 
    await mcl.init(CONFIG['CURVE_TYPE']);
    const msg = 'MY MESSAGE';

    const g = gjssService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);

    const r = utilityService.getRandomBits(s_k);
    const h = utilityService.getHashOfValue(); // TODO: hash
    const z = mcl.mul(h, a);

    const k = mclService.getRandomScalar();
    
    const u = mcl.mul(g, k);
    const v = mcl.mul(h, k);

    const c = gjssService.hashPrim(g, h, A, z, u, v); // TODO: hash

    const cx = mcl.mul(c, a);
    const s =  mcl.add(k, cx);

    let body = {
        protocol_name: 'gjss',
        payload: {
            A: A.getStr(10).slice(2),
            sigma: {
                z: z.getStr(),
                r: r.getStr(),
                s: s.getStr(),
                c: c.getStr()
            },
            msg: msg
        }
    };

    let responseData = await axios.post(address + '/protocols/gjss/verify', body);
    responseData = responseData.data;
    assert(responseData.verified);
}


module.exports = { gjss } 