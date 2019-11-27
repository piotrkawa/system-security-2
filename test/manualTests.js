const axios = require('axios');

const SIS = require('./sis');
const OIS = require('./ois');
const MSIS = require('./msis');
const SSS = require('./sss');
const BLSSS = require('./blsss');
const GJSS = require('./gjss');
const ENDPOINTS_CONFIG = require('../endpointsConfig');
const reqService = require('./requestCryptographyService');

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
let encryptionType = reqService.EncryptionType.none;

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
        encryptionType = reqService.EncryptionType.salsa;
    } else if (argv.includes('--chacha')) {
        url += '/chacha';
        encryptionType = reqService.EncryptionType.chacha;
    }
    
    return url;
}

async function test (url, encryptionType) {
    const sendPOSTRequest = reqService.getRequestFunction(encryptionType);
    const sendGETRequest = reqService.getRequestFunction(encryptionType, 'GET');
    performAvailableProtocols(sendGETRequest, sendPOSTRequest);
    // testManually(url, encryptionType);
}

async function testManually(url, encryptionType) {
    
    // SSS.sss(url, sendRequest);
    // const response = await axios.get(url + '/salsa/protocols');
    // console.log(response)
}

async function performAvailableProtocols(sendGETRequest, sendPOSTRequest) {
    const response = await sendGETRequest(`${url}/protocols`);
    const availableProtocols = response.data.schemas;
    console.log(`Available protocols: ${availableProtocols}`);
    for (protocol of availableProtocols) {
        if (MY_PROTOCOLS.hasOwnProperty(protocol)) {
            const protocolFunction = MY_PROTOCOLS[protocol];
            console.log(`Performing ${protocol}`);
            await protocolFunction(url, sendPOSTRequest);
        } else {
            console.log(`${protocol} not supported`)
        }
    }
}

let url = getURL();

test(url, encryptionType);
