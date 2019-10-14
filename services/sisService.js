// const mcl = require('mcl'); // TODO: how to import mcl???
const utilityService = require('../services/utilityService');
// const CURVE_TYPE = mcl.BLS12_381; // TODO: move to config.js

// mcl.init(CURVE_TYPE);

function generateC() {
    let c = 0;
    // mcl.init(CURVE_TYPE)
    //     .then(() => {
    //         try {
    //             const min = 0;
    //             const q = mcl.Q1();
    //             c = Math.floor(Math.random() * (q - min + 1)) + min;  
    //         } catch (e) {

    //         }
    //     });
    const min = 0;
    // const q = mcl.Q1();
    const q = 1;
    c = Math.floor(Math.random() * (q - min + 1)) + min;  
    return c; // # TODO: rand(0, q)
}

function verifyCommitment(session, s) {
    const A = session.payload.A;
    const X = session.payload.X;
    const c = session.payload.c;

    const isVerified = true;
    
    return isVerified;
}

module.exports = { generateC, verifyCommitment }