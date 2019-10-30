const { CONFIG, mcl } = require('../../config');
const mclService = require('./mclService');
const utilityService = require('./utilityService');


async function verifySignature(payload) {
    const sigmaPayload = payload.sigma;
    const X = mclService.generateG1(payload.X);
    const A = mclService.generateG1(payload.A);
    const msg = payload.msg;
    return false;
}


function getGroupGenerator () { 
    return mclService.generateG1(`${CONST_G.x} ${CONST_G.y}`); 
}

module.exports = { getGroupGenerator, computeC, verifySignature }