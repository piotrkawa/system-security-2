const { mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');


function computeC(msg, X) { 
    const inner = msg + X.getStr(10).slice(2);
    const intValue = utilityService.getHashOfValue(inner);
    return mclService.generateFr(intValue);
}

async function verifySignature(payload) {
    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    const s = mclService.generateFr(payload.s);
    const msg = payload.msg;
    const c = computeC(msg, X);    
    const g = mclService.getGroupGeneratorG1();

    const leftSide = mcl.mul(g, s);
    const rightSide = mcl.add(X, mcl.mul(A, c));

    return leftSide.getStr() === rightSide.getStr();
}


module.exports = { computeC, verifySignature }