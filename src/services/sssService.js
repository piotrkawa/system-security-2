const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const crypto = require('crypto');
const utilityService = require('./utilityService');


const CONST_G = CONFIG.sss.CONST_G;

function computeC(msg, X) { 
    const cString = utilityService.getHashOfValue(msg + X.getStr());
    return mcl.hashToFr(cString);
}

async function verifyCommitment(payload) {
    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    const s = mclService.generateFr(payload.s);
    const msg = payload.msg;
    const c = computeC(msg, X);    
    const g = getGroupGenerator();

    const leftSide = mcl.mul(g, s);
    const rightSide = mcl.add(X, mcl.mul(A, c));

    return leftSide.getStr() === rightSide.getStr();
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, computeC, verifyCommitment }