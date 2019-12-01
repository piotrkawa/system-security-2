const assert = require('assert');

const { mcl } = require('../config');
const mclService = require('../src/services/mclService');
const sssService = require('../src/services/sssService');

async function sss(address, HTTPMethods) {
    const { sendPOSTRequest } = HTTPMethods;
    const msg = "MY MESSAGE";

    const g = mclService.getGroupGeneratorG1();
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
    let response = await sendPOSTRequest(`${address}/protocols/sss/verify`, body);
    let responseData = response.data;
    assert(responseData.valid);
}


module.exports = { sss }