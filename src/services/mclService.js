const CONFIG = require('../../config').CONFIG;
const mcl = require('mcl-wasm');

mcl.init(CONFIG.CURVE_TYPE);

function generateG1 (pointString) {
    const point = new mcl.G1();
    point.setStr(`1 ${pointString}`);
    return point;
}

function generateG2 (pointString) {
    const point = new mcl.G2();
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

module.exports = { generateG1, generateG2, generateFr, getRandomScalar }