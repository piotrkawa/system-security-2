const mcl = require('mcl-wasm'); // TODO: how to import mcl???
const utilityService = require('../services/utilityService');
// const CURVE_TYPE = mcl.BLS12_381;

// mcl.init(CURVE_TYPE);

async function generateC() {
    await mcl.init(mcl.BLS12_381);
    let c = new mcl.Fr();
    c.setByCSPRNG()
    c = c.getStr()
    console.log('c: ' + c)
    return c; // # TODO: rand(0, q)
}

function verifyCommitment(session, s) {
    const A = session.A;
    const X = session.X;
    const c = session.c;
    console.log(session);

    const isVerified = true;
    


    
    return isVerified;
}

module.exports = { generateC, verifyCommitment }