const _sodium = require('libsodium-wrappers');

const { CONFIG }= require('../../config');


function encryptSalsa(data) {
    await _sodium.ready;
    const sodium = _sodium;
    let encoder = new te.TextEncoder('utf-8');
    const binKey = fs.readFileSync(CONFIG.SALSA_KEY_PATH);
    let key = sodium.from_hex(binKey.toString('hex'));
    let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
   
    data = encoder.encode(JSON.stringify(data));
    const ciphertext = sodium.crypto_secretbox_easy(data, nonce, key);
    data = {
        'ciphertext': sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
        'nonce': sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL)
    }
    return data;
}

function decryptSalsa(data) {
    await _sodium.ready;
    const sodium = _sodium;
    let decoder = new td.TextDecoder('utf-8');
    const binKey = fs.readFileSync(CONFIG.SALSA_KEY_PATH);
    let key = sodium.from_hex(binKey.toString('hex'));
    let nonce = sodium.from_base64(data.nonce, sodium.base64_variants.ORIGINAL);
    let ciphertext = sodium.from_base64(data.ciphertext, sodium.base64_variants.ORIGINAL);
    data = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
    return JSON.parse(decoder.decode(data));
}

function encryptChaCha(data) {
    throw new Error('Not implemented!');
}

function decryptChaCha(data) {
    throw new Error('Not implemented!');
}

module.exports = { encryptSalsa, decryptSalsa, encryptChaCha, decryptChaCha }
