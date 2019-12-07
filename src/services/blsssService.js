const { mcl } = require('../../config');
const mclService = require('./mclService');


async function verifySignature(payload) {
    const g = mclService.getGroupGeneratorG1();
    const A = mclService.generateG1(payload.A);
    const sigma = mclService.generateG2(payload.sigma);
    const msg = payload.msg;

    const h = mcl.hashAndMapToG2(msg);

    const leftSide = mcl.pairing(g, sigma)
    const rightSide = mcl.pairing(A, h)

    return leftSide.getStr() === rightSide.getStr();
}


module.exports = { verifySignature }