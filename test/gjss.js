const assert = require('assert');

const { CONFIG, mcl } = require('../config');
const mclService = require('../src/services/mclService');
const utilityService = require('../src/services/utilityService');
const gjssService = require('../src/services/gjssService');

const n_r = CONFIG.GJSS.n_r; // TODO: can be prettier


async function gjss(address, HTTPMethods) { 
    const { sendPOSTRequest } = HTTPMethods;
    await mcl.init(CONFIG['CURVE_TYPE']);
    const msg = 'MY MESSAGE';

    const g = mclService.getGroupGeneratorG1();
    const a = mclService.getRandomScalar();
    const A = mcl.mul(g, a);

    let r = utilityService.getRandomBits(n_r-1);
    r = '1' + r;
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

    let response = await sendPOSTRequest(`${address}/protocols/gjss/verify`, body);
    responseData = response.data;
    assert(responseData.valid);
}


module.exports = { gjss } 