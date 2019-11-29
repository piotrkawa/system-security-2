const { mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');


async function verifySignature(payload) {
    const sigmaPayload = payload.sigma;

    const s = mclService.generateFr(sigmaPayload.s);
    const c = mclService.generateFr(sigmaPayload.c);
    const r = sigmaPayload.r;
    const z = mclService.generateG1(sigmaPayload.z);
    const A = mclService.generateG1(payload.A);
    const msg = payload.msg;

    const g = mclService.getGroupGeneratorG1();

    const h = mcl.hashAndMapToG1(msg + r);
    
    const gs = mcl.mul(g, s);
    const yc = mcl.mul(A, c);
    const u = mcl.sub(gs, yc);

    const hs = mcl.mul(h, s);
    const zc = mcl.mul(z, c);
    const v = mcl.sub(hs, zc);

    let cPrim = hashPrim(g, h, A, z, u, v);
    cPrim = mclService.generateFr(cPrim);
    
    return cPrim.getStr() == c.getStr(); 
}

function hashPrim(...hashArguments) {
    let argument = "";
    for (arg of hashArguments) {
        argument += arg.getStr(10).slice(2);
    }
    return utilityService.getHashOfValue(argument);
}


module.exports = { verifySignature, hashPrim }