const mcl = require('mcl-wasm');
const CONFIG = require('../../config').CONFIG;
const CONST_G1 = CONFIG.CONST_G1;

mcl.init(CONFIG.CURVE_TYPE);

const generateG1 = function (pointString) {
    const point = new mcl.G1();
    a = `1 ${pointString}`
    // console.log('[][][][][][][][] ' + a)
    point.setStr(a);
    return point;
}

const generateFr = function (scalarString) {
    const scalar = new mcl.Fr();
    scalar.setStr(scalarString);
    return scalar;
}

function getRandomScalar() {
    let r = new mcl.Fr();
    r.setByCSPRNG();
    return r;
}

function getGroupGenerator() { 
    const G1 = new mcl.G1(); 
    G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`); 
    return G1; 
}

module.exports = { getGroupGenerator, generateG1, generateFr, getRandomScalar }