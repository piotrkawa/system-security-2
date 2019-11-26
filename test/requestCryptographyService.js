const cryptographyService = require("../src/services/cryptographyService");

const EncryptionType = {"none":1, "salsa":2, "chacha":3}
Object.freeze(EncryptionType)


async function encryptIfRequired (encryptionType, data) {
    switch(encryptionType) {
        case EncryptionType.none:
            return data;
        case EncryptionType.salsa:
            return await cryptographyService.encryptSalsa(data);
        case EncryptionType.chacha:
            return await cryptographyService.encryptChaCha(data);
        default:
            throw new Error(`Encryption ${encryptionType} is not supported`);
    }
}

async function decryptIfRequired (encryptionType, data) {
    switch(encryptionType) {
        case EncryptionType.none:
            return data;
        case EncryptionType.salsa:
            return await cryptographyService.decryptSalsa(data);
        case EncryptionType.chacha:
            return await cryptographyService.decryptChaCha(data);
        default:
            throw new Error(`Encryption ${encryptionType} is not supported`);
    }
}

module.exports = { EncryptionType, encryptIfRequired, decryptIfRequired }