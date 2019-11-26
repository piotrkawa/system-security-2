const express = require('express');
const router = express.Router();
const mung = require('express-mung');

const cryptographyService = require('../services/cryptographyService');
const standardRoutes = require('./routes');


async function decryptRequest(req, res, next) {
    if (req.body !== {}) {
        req.body = await cryptographyService.decryptChaCha(req.body);
    }
    next();
}

async function encryptResponse(body, req, res) {
    return await cryptographyService.encryptChaCha(body);
}

router.use(decryptRequest, mung.jsonAsync(encryptResponse), standardRoutes);

module.exports = router