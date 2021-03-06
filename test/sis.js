const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');


async function sis(address, HTTPMethods) {
    const { sendPOSTRequest } = HTTPMethods;
    await mcl.init(CONFIG['CURVE_TYPE']);

    const g = mclService.getGroupGeneratorG1();
    const a = mclService.getRandomScalar();
    const x = mclService.getRandomScalar();

    const A = mcl.mul(g, a);
    const X = mcl.mul(g, x);

    let body = {
        protocol_name: 'sis',
        payload: {
            A: A.getStr(10).slice(2),
            X: X.getStr(10).slice(2)
        }
    };

    let response = await sendPOSTRequest(`${address}/protocols/sis/init`, body);
    const sessionToken = response.data.session_token;
    const c = new mcl.Fr();
    c.setStr(response.data.payload.c);

    const ac = mcl.mul(a, c);
    const s = mcl.add(ac, x);    

    body = {
        protocol_name: 'sis',
        session_token: sessionToken,
        payload: {
            's': s.getStr(10)
        }
    };

    response = await sendPOSTRequest(`${address}/protocols/sis/verify`, body);
    assert(response.data.verified)
}

module.exports = { sis }