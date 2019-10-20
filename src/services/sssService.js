const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const sha512 = require('js-sha512');

const CONST_G = CONFIG.sss.CONST_G;

async function computeC(msg, X) { 
    const inner = msg + X.getStr();
    const cString = sha512.digest(inner);
    return mcl.hashToFr(cString);
}

async function verifyCommitment(payload) {
    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    const s = mclService.generateFr(payload.s);
    const msg = payload.msg;
    const c = await computeC(msg, X);    
    const g = getGroupGenerator();

    const leftSide = mcl.mul(g, s);
    const rightSide = mcl.add(X, mcl.mul(A, c));

    return leftSide.getStr() === rightSide.getStr();
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, computeC, verifyCommitment }