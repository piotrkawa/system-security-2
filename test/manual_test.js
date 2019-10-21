const axios = require('axios');
const mcl = require('mcl-wasm');
const assert = require('assert');

const CONFIG = require('../config').CONFIG;
const mclService = require('../src/services/mclService');
const oisService = require('../src/services/oisService');
const sssService = require('../src/services/sssService');

const instance = axios.create({
    headers: {
        'Connection': 'keep-alive'
    },
    proxy: { host: '127.0.0.1', port: 3000 },
    timeout: 100000,
});

ROOT = 'http://127.0.0.1:3000'


async function manualSSS() {
    await mcl.init(CONFIG.CURVE_TYPE);
    
    const msg = "JAN PAWEŁ DRUGI";

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

    let responseData = await axios.post(ROOT + '/protocols/sss/verify', body);
    responseData = responseData.data;
    // console.log(responseData);
    assert(responseData.verified);
}

manualSSS()

async function manualOIS() { 
    await mcl.init(CONFIG.CURVE_TYPE);
    
    const { g1, g2 } = oisService.getGroupGenerators();
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

    console.log('################## init body ##################');
    console.log(body);

    let responseData = await axios.post(ROOT + '/protocols/ois/init', body);
    responseData = responseData.data;
    
    console.log('################## init reponse ##################');
    console.log(responseData);

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

    console.log('################## verify body ##################');
    console.log(body);

    resp = await instance.post(ROOT + '/protocols/ois/verify', body);
    responseData = resp.data
    console.log('################## verify response ##################');
    assert(responseData.verified);
}

async function manualSIS() {

}

// manualOIS()