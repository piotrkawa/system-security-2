const mclService = require('./mclService');
const { mcl } = require('../../config');


function generateC() { 
    return mclService.getRandomScalar().getStr();
}

function verifyCommitment(session, s1Request, s2Request) {
    const payload = session.payload;

    const A = mclService.generateG1(payload.A);
    const X = mclService.generateG1(payload.X);

    const c = mclService.generateFr(payload.c);
    const s1 = mclService.generateFr(s1Request);
    const s2 = mclService.generateFr(s2Request);

    const generators = getGroupGenerators();
    const g1 = generators.g1;
    const g2 = generators.g2;

    const gs1 = mcl.mul(g1, s1);
    const gs2 = mcl.mul(g2, s2);
    
    const leftSide = mcl.add(gs1, gs2)
    const rightSide = mcl.add(X, mcl.mul(A, c));
    return leftSide.getStr() === rightSide.getStr()
}

function getGroupGenerators() {
    const g1 = mclService.getGroupGeneratorG1();
    const g2 = mclService.getGroupGeneratorG2();
    return { g1, g2 }
}


module.exports = { generateC, verifyCommitment }