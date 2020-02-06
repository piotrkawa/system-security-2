const mcl = require('mcl-wasm');

const CONFIG = {
    HTTPS_PORT: 8443,
    HTTP_PORT: 8080,
    CURVE_TYPE: mcl.BLS12_381,
    CURRENTLY_SUPPORTED_PROTOCOLS: [
        'sis',
        'ois',
        'sss',
        'msis',
        'blsss',
        'gjss',
        'naxos',
        'sigma'
    ],
    r: '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001',
    SALSA_KEY_PATH: '/home/pietrek/UCZELNIA/system-security-2/assets/encryption_keys/salsa_key.bin',
    CHACHA_KEY_PATH: '/home/pietrek/UCZELNIA/system-security-2/assets/encryption_keys/chacha_key.bin',
    CONST_G1: {
        x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
        y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569'
    },
    CONST_G2: {
        x: '2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427',
        y: '2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013'
    },
    GJSS: {
        n_r: 111,
    },
    KEYS: {
        PUBLIC_KEY: {
            x: '2389426000441046932969125298635852456301284600369289406896964152705688362213251713028191335665916082977181201434002',
            y: '1936437218914155285673041485968122987521958872506310017146666439203123558599779158923411095019027584931710482711655'
        },
        SECRET_KEY: '25626253293736037937849508082742758494135325765906886536989434991585443483432',
    }
};

mcl.init(CONFIG['CURVE_TYPE']);

module.exports = { CONFIG, mcl }
