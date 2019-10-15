const axios = require('axios');
const mclService = require('../src/services/mclService');
const mcl = require('mcl-wasm');
const CONFIG = require('../config').CONFIG;


ROOT = 'http://127.0.0.1:3000'

// axios.get(ROOT + '/protocols/')
//     .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })

async function abc() { 
    await mcl.init(CONFIG.CURVE_TYPE);
    
    const g = mclService.getGroupGenerator();
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

    console.log('################## init body ##################');
    console.log(body);

    let responseData;
    await axios.post(ROOT + '/protocols/sis/init', body)
        .then(function (response) {
            responseData = response.data;
        });

    console.log('################## init reponse ##################');
    console.log(responseData);

    const session_token = responseData.session_token; 
    const c = new mcl.Fr();
    c.setStr(responseData.payload.c);

    const ac = mcl.mul(a, c);
    const s = mcl.add(ac, x);    
    
    body = {
        protocol_name: 'sis',
        session_token: session_token,
        payload: {
            's': s.getStr(10)
        }
    };
    console.log('################## verify body ##################');
    console.log(body);

    resp = await axios.post(ROOT + '/protocols/sis/verify', body);
    responseData = resp.data
    console.log('################## verify response ##################');
    console.log(responseData);
}

abc()

/*

async function testPerformValidCommitment() {
  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(G1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);

  const serializedA = A.getStr(10).slice(2);
  const serializedX = X.getStr(10).slice(2);

  const initResponseData = await performInitRequest({
    "protocol_name": "sis",
    "payload": {
      "A": serializedA,
      "X": serializedX,
    }
  })

  const serializedC = initResponseData.payload.c;
  const c = new mcl.Fr();
  c.setStr(serializedC);

  const ac = mcl.mul(a, c);
  const s = mcl.add(ac, x);

  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "sis",
    "session_token": initResponseData.session_token,
    "payload": {
      "s": s.getStr(10),
    }
  });

  if (!verifyResponseData.verified) {
    throw "testPerformValidCommitment failed"
  }
}
*/