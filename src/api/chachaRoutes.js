const express = require('express')
const router = express.Router()
const standardRoutes = require('./routes')

const encryptDecryptMiddleware = async function(req, res, next){
    let oldSend = res.send;
    // TODO: encrypt

    res.send = function(data) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        // TODO: decrypt
        const ciphertext = null;
        const nonce = null;

        const oldData = data;
        data = {
            ciphertext: ciphertext,
            nonce: nonce
        };

        data = JSON.stringify(data);
        oldSend.apply(res, arguments);
    }
    next();
};

router.use(encryptDecryptMiddleware, standardRoutes);

module.exports = router