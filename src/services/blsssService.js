const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');


const CONST_G = CONFIG.sss.CONST_G;


async function verifySignature(payload) {
    const g = getGroupGenerator();
    const A = mclService.generateG1(payload.A);
    const sigma = mclService.generateG2(payload.sigma);
    const msg = payload.msg;

    const h = mcl.hashAndMapToG2(msg);
   
    const leftSide = mcl.pairing(g, sigma)
    const rightSide = mcl.pairing(A, h)

    return leftSide.getStr() === rightSide.getStr();
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, verifySignature }