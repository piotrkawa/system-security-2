const { mcl } = require('../../config');
const mclService = require('./mclService');


function generateC () { 
    return mclService.getRandomScalar().getStr();
}

async function verifyCommitment (session, sRequest) {
    const payload = session.payload;

    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);
    const c = mclService.generateFr(payload.c);
    const s = mclService.generateFr(sRequest);

    const g = mclService.getGroupGeneratorG1();

    const leftSide = mcl.mul(g, s);
    const rightSide = mcl.add(X, mcl.mul(A, c));

    return leftSide.getStr() === rightSide.getStr();
}

module.exports = { generateC, verifyCommitment }