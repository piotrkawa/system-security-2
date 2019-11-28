const cryptographyService = require('../src/services/cryptographyService');
const axios = require('axios');

const EncryptionType = { 'none': 1, 'salsa': 2, 'chacha': 3 }
Object.freeze(EncryptionType)

// TODO: decorator or something!!!

function getRequestFunction (encryptionType, method = 'POST') {
    if (method === 'POST') {
        switch (encryptionType) {
            case EncryptionType.none:
                return sendPOST;
            case EncryptionType.salsa:
                return sendPOSTSalsa;
            case EncryptionType.chacha:
                return sendPOSTChaCha;
            default:
                throw new Error(`Encryption ${encryptionType} is not supported`);
        }
    } else if (method === 'GET') {
        switch (encryptionType) {
            case EncryptionType.none:
                return sendGET;
            case EncryptionType.salsa:
                return sendGETSalsa;
            case EncryptionType.chacha:
                return sendGETChaCha;
            default:
                throw new Error(`Encryption ${encryptionType} is not supported`);
        }
    }
}

async function sendPOST (url, body) {
    return await axios.post(url, body);
}

async function sendPOSTSalsa (url, body) {
    body = await cryptographyService.encryptSalsa(body);
    let response = await axios.post(url, body);
    response.data = await cryptographyService.decryptSalsa(response.data);
    return response
}

async function sendPOSTChaCha (url, body) {
    body = await cryptographyService.encryptChaCha(body);
    let response = await axios.post(url, body);
    response.data = await cryptographyService.decryptChaCha(response.data);
    return response
}

async function sendGET (url) {
    return await axios.get(url);
}

async function sendGETSalsa (url) {
    let response = await axios.get(url);
    response.data = await cryptographyService.decryptSalsa(response.data);
    return response
}

async function sendGETChaCha (url) {
    let response = await axios.get(url);
    response.data = await cryptographyService.decryptChaCha(response.data);
    return response
}

module.exports = { EncryptionType, getRequestFunction, sendPOST, sendPOSTChaCha, sendPOSTSalsa, sendGET, sendGETChaCha, sendGETSalsa }