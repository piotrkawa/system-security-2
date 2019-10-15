const mclService = require('./mclService');

async function generateC() { 
    return mclService.getRandomScalar().getStr();
}

async function verifyCommitment(session, s1Request, s2Request) {

    const A = mclService.generateG1(session.A);
    const X = mclService.generateG1(session.X);
    const c = mclService.generateFr(session.c);
    const s1 = mclService.generateFr(s1Request);
    const s2 = mclService.generateFr(s2Request);

    // const g1 = mclService.getGroupGenerator();
    // const g2 = mclService.getGroupGenerator();

    const gs1 = mcl.mul(g1, s1);
    const gs2 = mcl.mul(g2, s2);
    
    const leftSide = mcl.add(gs1, gs2)
    const rightSide = mcl.add(X, mcl.mul(A, c));
    return leftSide.getStr() === rightSide.getStr()
}

module.exports = { generateC, verifyCommitment }