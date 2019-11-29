const assert = require('assert');

const { CONFIG, mcl } = require('../config');
const mclService = require('../src/services/mclService');


async function ois(address, sendRequest) { 
    await mcl.init(CONFIG['CURVE_TYPE']);

    const g1 = mclService.getGroupGeneratorG1();
    const g2 = mclService.getGroupGeneratorG2();

    const a1 = mclService.getRandomScalar();
    const a2 = mclService.getRandomScalar();
    const A1 = mcl.mul(g1, a1);
    const A2 = mcl.mul(g2, a2);
    const A = mcl.add(A1, A2)
    
    const x1 = mclService.getRandomScalar();
    const x2 = mclService.getRandomScalar();
    const X1 = mcl.mul(g1, x1);
    const X2 = mcl.mul(g2, x2);
    const X = mcl.add(X1, X2);

    let body = {
        protocol_name: 'ois',
        payload: {
            A: A.getStr(10).slice(2),
            X: X.getStr(10).slice(2)
        }
    };

    let responseData = await sendRequest(`${address}/protocols/ois/init`, body);
    responseData = responseData.data;
    
    const session_token = responseData.session_token; 
    const c = new mcl.Fr();
    c.setStr(responseData.payload.c);

    const ac1 = mcl.mul(a1, c);
    let s1 = mcl.add(ac1, x1);

    const ac2 = mcl.mul(a2, c);
    let s2 = mcl.add(ac2, x2);

    body = {
        protocol_name: 'ois',
        session_token: session_token,
        payload: {
            's1': s1.getStr(10),
            's2': s2.getStr(10)
        }
    };

    response = await sendRequest(`${address}/protocols/ois/verify`, body);
    responseData = response.data;
    assert(responseData.verified);
}


module.exports = { ois } 