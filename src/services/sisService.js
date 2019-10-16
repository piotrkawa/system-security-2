const mcl = require('mcl-wasm');
const CONFIG = require('../../config').CONFIG;

const mclService = require('./mclService');

mcl.init(CONFIG.CURVE_TYPE); // TODO: move out

async function generateC() { 
    return mclService.getRandomScalar().getStr();
}

async function verifyCommitment(session, sRequest) {
    const payload = session.payload

    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    const c = mclService.generateFr(payload.c);
    const s = mclService.generateFr(sRequest);

    const g = mclService.getGroupGenerator();

    const leftSide = mcl.mul(g, s);
    const rightSide = mcl.add(X, mcl.mul(A, c));

    // console.log('#######################')
    // console.log('left side: ' + leftSide.getStr());
    // console.log('right side: ' + rightSide.getStr());
    return leftSide.getStr() === rightSide.getStr();
}

module.exports = { generateC, verifyCommitment }