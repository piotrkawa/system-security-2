const router = require('express').Router();

const sssService = require('../../services/sssService');
const { LOGGER } = require('../../../logging');


router.post('/verify', async function (req, res) {
    LOGGER.log({message: `[SSS Verify] Verify started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[SSS Verify] Payload: ${JSON.stringify(payload)}`});

    try {
        const isValid = await sssService.verifySignature(payload);
        LOGGER.log({message: `[SSS Verify] Valid: ${isValid}`});
        res.send({'valid': isValid});
    } catch (e) {
        LOGGER.log({message: `[SSS Verify] Validation not successful`});
        res.sendStatus(403);
    }
})

module.exports = router;