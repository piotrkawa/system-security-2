const mcl = require('mcl-wasm');

const CONFIG = {
    'CURVE_TYPE': mcl.BLS12_381,
    'CURRENTLY_SUPPORTED_PROTOCOLS': ['sis', 'ois'],
    sis: {
        CONST_G: { 
            x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
            y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569'
        },
    },
    'ois': {
        'CONST_G1': {
            x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
            y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569'
        },
        'CONST_G2': {
            x: '2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427',
            y: '2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013'   
        }
    }  
};

mcl.init(CONFIG.CURVE_TYPE);

// module.exports = { CONFIG, mcl }
module.exports = { CONFIG }  