const mcl = require('mcl-wasm');
const CURVE_TYPE = mcl.BLS12_381;
mcl.init(CURVE_TYPE);

const CONST_G1 = { 
    x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
    y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569'
}

const generateG1 = function (pointString) {
    const point = new mcl.G1();
    point.setStr("1 " + pointString);
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