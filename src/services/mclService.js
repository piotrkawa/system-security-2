const mcl = require('mcl-wasm');
const CONFIG = require('../../config').CONFIG;
const CONST_G1 = CONFIG.CONST_G1;

mcl.init(CONFIG.CURVE_TYPE);

function generateG1 (pointString) {
    const point = new mcl.G1();
    point.setStr(`1 ${pointString}`);
    return point;
}

function generateFr (scalarString) {
    const scalar = new mcl.Fr();
    scalar.setStr(scalarString);
    return scalar;
}

function getRandomScalar () {
    let r = new mcl.Fr();
    r.setByCSPRNG();
    return r;
}

function getGroupGenerator () { 
    return generateG1(`${CONST_G1.x} ${CONST_G1.y}`); 
}

module.exports = { getGroupGenerator, generateG1, generateFr, getRandomScalar }