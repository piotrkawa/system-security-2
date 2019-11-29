const { CONFIG, mcl } = require('../../config');


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

function getGroupGeneratorG1 () {
    return generateG1(`${CONFIG.CONST_G1.x} ${CONFIG.CONST_G1.y}`);
}

function getGroupGeneratorG2 () {
    return generateG1(`${CONFIG.CONST_G2.x} ${CONFIG.CONST_G2.y}`);
}

module.exports = { generateG1, generateG2, generateFr, getRandomScalar, getGroupGeneratorG1, getGroupGeneratorG2 }