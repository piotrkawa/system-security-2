const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');


const CONST_G = CONFIG.sss.CONST_G;


async function verifySignature(payload) {
    const sigmaPayload = payload.sigma;

    const s = mclService.generateFr(sigmaPayload.s);
    const c = mclService.generateFr(sigmaPayload.c);
    const r = sigmaPayload.r;
    const z = mclService.generateFr(sigmaPayload.z);
    const A = mclService.generateG1(payload.A);
    const msg = payload.msg;

    const g = getGroupGenerator();

    const h = mclService.generateFr(utilityService.getHashOfValue(msg + r));
    
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
        argument += hashArguments;
    }
    return utilityService.getHashOfValue(argument);
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, verifySignature, hashPrim }