const reqService = require('./requestCryptographyService');
const ENDPOINTS_CONFIG = require('../endpointsConfig');
const MY_PROTOCOLS = {
    'sis': require('./sis').sis,
    'ois': require('./ois').ois,
    'msis': require('./msis').msis,
    'sss': require('./sss').sss,
    'blsss': require('./blsss').blsss,
    'gjss': require('./gjss').gjss,
    'naxos': require('./naxos').naxos,
    'sigma': require('./sigma').sigma
};

const PERSON = 'localhost';
const address = ENDPOINTS_CONFIG[PERSON].address;

let encryptionType = reqService.EncryptionType.none;

function getURL() {
    const argv = (process.argv.slice(2));

    let port = 8080;
    let url = `http://${address}:${port}`;

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

async function test(url, encryptionType) {
    const sendPOSTRequest = reqService.getRequestFunction(encryptionType);
    const sendGETRequest = reqService.getRequestFunction(encryptionType, 'GET');
    const HTTPMethods = {
        'sendPOSTRequest': sendPOSTRequest,
        'sendGETRequest': sendGETRequest
    };

    // performAvailableProtocols(url, HTTPMethods);
    testManually(url, HTTPMethods);
}

async function testManually(url, HTTPMethods) {
    // await NAXOS.naxos(url, HTTPMethods);
    await require('./sigma').sigma(url, HTTPMethods);
}

async function performAvailableProtocols(url, HTTPMethods) {
    const { sendGETRequest } = HTTPMethods;
    const response = await sendGETRequest(`${url}/protocols`);
    const availableProtocols = response.data.schemas;
    console.log(`Available protocols: ${availableProtocols}`);
    for (protocol of availableProtocols) {
        if (MY_PROTOCOLS.hasOwnProperty(protocol)) {
            const protocolFunction = MY_PROTOCOLS[protocol];
            console.log(`Performing ${protocol}`);
            await protocolFunction(url, HTTPMethods);
        } else {
            console.log(`${protocol} not supported`)
        }
    }
}

let url = getURL();

test(url, encryptionType);
