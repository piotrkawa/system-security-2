const axios = require('axios');
const https = require('https');
const fs = require('fs');
const SIS = require('./sis');
const OIS = require('./ois');
const MSIS = require('./msis');
const SSS = require('./sss');
const BLSSS = require('./blsss');
const GJSS = require('./gjss');


var argv = (process.argv.slice(2));
const ENDPOINTS_CONFIG = require('../endpointsConfig');

const MY_PROTOCOLS = {
    'sis': SIS.sis,
    'ois': OIS.ois,
    'msis': MSIS.msis,
    'sss': SSS.sss,
    // 'blsss': BLSSS.blsss,
    'gjss': GJSS.gjss
};

const PERSON = 'localhost';
const address = ENDPOINTS_CONFIG[PERSON].address;

let url = '';

if (argv.includes('--https')) {
    let port = ENDPOINTS_CONFIG['httpsPort'];
    url = `https://${address}:${port}`
} else {
    let port = 8080;
    url = `http://${address}:${port}`
}

async function test () {
    // performAvailableProtocols()
    testManually()
}

async function testManually() {
    // GJSS.gjss(ROOT);
    GJSS.gjss(url);
}

async function performAvailableProtocols() {
    const response = await axios.get(url + '/protocols');
    const availableProtocols = response.data.schemas;
    console.log(`Available protocols: ${availableProtocols}`);
    for (protocol of availableProtocols) {
        if (MY_PROTOCOLS.hasOwnProperty(protocol)) {
            const func = MY_PROTOCOLS[protocol];
            console.log(`Performing ${protocol}`);
            await func(url);
        } else {
            console.log(`${protocol} not supported`)
        }
    }
}

test()
