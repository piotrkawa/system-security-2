const mcl = require('mcl-wasm');
const CONFIG = require('../config').CONFIG;
const mclService = require('./mclService');

async function generateC() { 
    return mclService.getRandomScalar().getStr();
}

async function verifyCommitment(session, sRequest) {
    await mcl.init(CONFIG.CURVE_TYPE); // TODO: move out

    const A = mclService.generateG1(session.A);
    const X = mclService.generateG1(session.X);
    const c = mclService.generateFr(session.c);
    const s = mclService.generateFr(sRequest);

    const g = mclService.getGroupGenerator();

    const leftSide = mcl.mul(g, s);
    const rightSide = mcl.add(X, mcl.mul(A, c));

    console.log('#######################')
    console.log('left side: ' + leftSide.getStr());
    console.log('right side: ' + rightSide.getStr());
    return leftSide.getStr() === rightSide.getStr();
}

module.exports = { generateC, verifyCommitment }