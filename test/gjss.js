const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');
const utilityService = require('../src/services/utilityService');
const gjssService = require('../src/services/gjssService');

const n_r = CONFIG.gjss.n_r; // TODO: can be prettier


async function gjss(address, sendRequest) { 
    await mcl.init(CONFIG['CURVE_TYPE']);
    const msg = 'MY MESSAGE';

    const g = gjssService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);

    const r = utilityService.getRandomBits(n_r);
    const h = mcl.hashAndMapToG1(msg + r);
    const z = mcl.mul(h, a);

    const k = mclService.getRandomScalar();
    
    const u = mcl.mul(g, k);
    const v = mcl.mul(h, k);

    const c = mclService.generateFr(gjssService.hashPrim(g, h, A, z, u, v));

    const cx = mcl.mul(a, c);
    const s =  mcl.add(k, cx);

    let body = {
        protocol_name: 'gjss',
        payload: {
            A: A.getStr(10).slice(2),
            sigma: {
                z: z.getStr(10).slice(2),
                r: r,
                s: s.getStr(),
                c: c.getStr()
            },
            msg: msg
        }
    };

    let response = await sendRequest(`${address}/protocols/gjss/verify`, body);
    responseData = response.data;
    assert(responseData.valid);
}


module.exports = { gjss } 