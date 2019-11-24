const axios = require('axios');

const SIS = require('./sis');
const OIS = require('./ois');
const MSIS = require('./msis');
const SSS = require('./sss');
const BLSSS = require('./blsss');
const GJSS = require('./gjss');
const ENDPOINTS_CONFIG = require('../endpointsConfig');


const PERSON = 'localhost';
const address = ENDPOINTS_CONFIG[PERSON].address;
const MY_PROTOCOLS = {
    'sis': SIS.sis,
    'ois': OIS.ois,
    'msis': MSIS.msis,
    'sss': SSS.sss,
    'blsss': BLSSS.blsss,
    'gjss': GJSS.gjss
};


function getURL() {
    const argv = (process.argv.slice(2)); 

    let port = 8080;
    let url = `http://${address}:${port}`
    
    if (argv.includes('--https')) {
        port = ENDPOINTS_CONFIG['httpsPort'];
        url = `https://${address}:${port}`
    }
    
    if (argv.includes('--salsa')) {
        url += '/salsa';
    } else if (argv.includes('--chacha')) {
        url += '/chacha';
    }
    
    return url;
}

async function test (url) {
    // performAvailableProtocols();
    testManually(url);
}

async function testManually(url) {
    SSS.sss(url);
    // const response = await axios.get(url + '/salsa/protocols');
    // console.log(response)
}

async function performAvailableProtocols() {
    const response = await axios.get(url + '/protocols');
    const availableProtocols = response.data.schemas;
    console.log(`Available protocols: ${availableProtocols}`);
    for (protocol of availableProtocols) {
        if (MY_PROTOCOLS.hasOwnProperty(protocol)) {
            const protocolFunction = MY_PROTOCOLS[protocol];
            console.log(`Performing ${protocol}`);
            await protocolFunction(url, PREFIX);
        } else {
            console.log(`${protocol} not supported`)
        }
    }
}

let url = getURL();

test(url);
