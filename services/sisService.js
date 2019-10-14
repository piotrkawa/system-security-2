const utilityService = require('../services/utilityService');
 
function generateC() {
    return 1; // # TODO: generate C
}

function verifyCommitment(session, s) {
    const A = session.payload.A;
    const X = session.payload.X;
    const c = session.payload.c;

    const isVerified = true;
    
    return isVerified;
}

module.exports = { generateC, verifyCommitment }