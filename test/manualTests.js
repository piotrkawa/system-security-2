const axios = require('axios');

const SIS = require('./sis');
const OIS = require('./ois');
const MSIS = require('./msis');
const SSS = require('./sss');
const ENDPOINTS_CONFIG = require('../endpointsConfig');

const MY_PROTOCOLS = {
    'sis': SIS.sis,
    'ois': OIS.ois,
    'msis': MSIS.msis,
    'sss': SSS.sss,
};

const { address, port } = ENDPOINTS_CONFIG['localhost'];
const ROOT = `http://${address}:${port}`

async function test () {
    performAvailableProtocols()
}

async function performAvailableProtocols() {
    const response = await axios.get(ROOT + '/protocols');
    const availableProtocols = response.data.schemas;
    for (protocol of availableProtocols) {
        if (MY_PROTOCOLS.hasOwnProperty(protocol)) {
            const func = MY_PROTOCOLS[protocol]
            console.log(`Performing ${protocol}`)
            await func(ROOT)
        } else {
            console.log(`${protocol} not supported`)
        }
    }
}

test()
