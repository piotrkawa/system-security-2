const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');

const CONST_G = CONFIG.CONST_G1;

function generateC () { 
    return mclService.getRandomScalar().getStr();
}

async function verifyCommitment (session, sRequest) {
    const payload = session.payload;

    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    const c = mclService.generateFr(payload.c);
    const s = mclService.generateFr(sRequest);

    const g = getGroupGenerator();

    const leftSide = mcl.mul(g, s);
    const rightSide = mcl.add(X, mcl.mul(A, c));

    return leftSide.getStr() === rightSide.getStr();
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, generateC, verifyCommitment }