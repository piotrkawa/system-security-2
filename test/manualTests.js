const SIS = require('./sis');
const OIS = require('./ois');
const MSIS = require('./msis');
const SSS = require('./sss');
const ENDPOINTS_CONFIG = require('../endpointsConfig');


const { address, port } = ENDPOINTS_CONFIG['localhost'];
const ROOT = `http://${address}:${port}`

async function test () {
    await SIS.sis(ROOT);
    await OIS.ois(ROOT);
    await MSIS.msis(ROOT);
    await SSS.sss(ROOT);
}

test()