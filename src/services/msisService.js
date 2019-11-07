const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');

const CONST_G = CONFIG.msis.CONST_G;

function generateC () { 
    return mclService.getRandomScalar().getStr();
}

async function verifyCommitment (session, SRequest) {
    const payload = session.payload;

    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    const c = mclService.generateFr(payload.c);
    const S = mclService.generateG2(SRequest);

    const g = getGroupGenerator();

    const gHat = mcl.hashAndMapToG2(X.getStr(10).slice(2) + c.getStr(10));
    const XAc = mcl.add(X, mcl.mul(A, c)); 
    
    const leftSide = mcl.pairing(g, S)
    const rightSide = mcl.pairing(XAc, gHat)
    
    return leftSide.getStr() === rightSide.getStr();
}


function getGroupGenerator () {
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, generateC, verifyCommitment }