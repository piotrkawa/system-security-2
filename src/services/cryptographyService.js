const chacha = require('chacha');
const crypto = require('crypto');
const _sodium = require('libsodium-wrappers');
const fs = require('fs');
const te = require('text-encoding');
const td = require('text-decoding');

const { CONFIG } = require('../../config');


async function encryptSalsa(data) {
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

async function decryptSalsa(data) {
    await _sodium.ready;
    const sodium = _sodium;
    const decoder = new td.TextDecoder('utf-8');
    const binKey = fs.readFileSync(CONFIG.SALSA_KEY_PATH);
    const key = sodium.from_hex(binKey.toString('hex'));
    const nonce = sodium.from_base64(data.nonce, sodium.base64_variants.ORIGINAL);
    const ciphertext = sodium.from_base64(data.ciphertext, sodium.base64_variants.ORIGINAL);
    data = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
    return JSON.parse(decoder.decode(data));
}

async function encryptChaCha(data) {
    const nonce = crypto.randomBytes(12);
    const binKey = fs.readFileSync(CONFIG.CHACHA_KEY_PATH, null);
    const chachaCipher = chacha.createCipher(binKey, nonce);
    data = Buffer.from(JSON.stringify(data), 'utf8');
    const ciphertext = chachaCipher.update(data, 'utf8');
    await chachaCipher.final();
    const tag = chachaCipher.getAuthTag();
    data = {
        'ciphertext': ciphertext.toString('base64'),
        'nonce': nonce.toString('base64'),
        'tag': tag.toString('base64')
    }
    return data;
}

async function decryptChaCha(data) {
    const binKey = fs.readFileSync(CONFIG.CHACHA_KEY_PATH, null);
    let nonce = Buffer.from(data.nonce, 'base64');
    let tag = Buffer.from(data.tag, 'base64');
    let ciphertext = Buffer.from(data.ciphertext, 'base64');
    const chcachaDecipher = chacha.createDecipher(binKey, nonce);
    chcachaDecipher.setAuthTag(tag);
    data = chcachaDecipher.update(ciphertext, 'utf8');
    return JSON.parse(data.toString('ascii'));
}

module.exports = { encryptSalsa, decryptSalsa, encryptChaCha, decryptChaCha }
