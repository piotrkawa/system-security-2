const axios = require('axios');
const mcl = require('mcl-wasm');
const asser = require('assert');

const CONFIG = require('../config').CONFIG;
const mclService = require('../src/services/mclService');
const oisService = require('../src/services/oisService');

const instance = axios.create({
    headers: {
        'Connection': 'keep-alive'
    },
    proxy: { host: '127.0.0.1', port: 3000 },
    timeout: 100000,
});

ROOT = 'http://127.0.0.1:3000'

async function abc() { 
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
    console.log(responseData);
}



async function def() { 
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


    const A_str = A.getStr(10).slice(2);
    const X_str = X.getStr(10).slice(2);
    let body = {
        protocol_name: 'ois',
        payload: {
            A: A_str,
            X: X_str
        }
    };

    console.log('################## init body ##################');
    console.log(body);

    const c_resp = await oisService.generateC(); 
    const c = new mcl.Fr();
    c.setStr(c_resp);

    const ac1 = mcl.mul(a1, c);
    let s1 = mcl.add(ac1, x1);
    
    const ac2 = mcl.mul(a2, c);
    let s2 = mcl.add(ac2, x2);
    
    body = {
        protocol_name: 'ois',
        // session_token: session_token,
        payload: {
            's1': s1.getStr(10),
            's2': s2.getStr(10)
        }
    };

    const payload = body.payload;
    const A_ = mclService.generateG1(A_str);
    const X_ = mclService.generateG1(X_str);

    const c_ = c;
    const s1_ = mclService.generateFr(payload.s1);
    const s2_ = mclService.generateFr(payload.s2);

    const generators = oisService.getGroupGenerators();
    const g1_ = generators.g1 ;
    const g2_ = generators.g2;

    const gs1_ = mcl.mul(g1_, s1_);
    const gs2_ = mcl.mul(g2_, s2_);
    
    const leftSide = mcl.add(gs1_, gs2_)
    const rightSide = mcl.add(X_, mcl.mul(A_, c_));
    console.log(leftSide.getStr() === rightSide.getStr())
}

// abc()

// def()