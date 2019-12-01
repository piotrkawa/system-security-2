const assert = require('assert');

const { mcl } = require('../config');
const mclService = require('../src/services/mclService');


async function blsss(address, HTTPMethods) {
    const { sendPOSTRequest } = HTTPMethods;
    const msg = 'MY MESSAGE';

    const g = mclService.getGroupGeneratorG1();
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

    let responseData = await sendPOSTRequest(`${address}/protocols/blsss/verify`, body);
    responseData = responseData.data;
    assert(responseData.valid);
}


module.exports = { blsss }