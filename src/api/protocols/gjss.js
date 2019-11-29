const router = require('express').Router();

const gjssService = require('../../services/gjssService');
const { LOGGER } = require('../../../logging');


router.post('/verify', async function (req, res) {
    LOGGER.log({message: `[GJSS Verify] Verify started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[GJSS Verify] Payload: ${JSON.stringify(payload)}`});

    try {
        const isValid = await gjssService.verifySignature(payload);
        LOGGER.log({message: `[GJSS Verify] Valid: ${isValid}`});
        res.send({'valid': isValid});
    } catch (e) {
        LOGGER.log({message: `[GJSS Verify] Validation not successful`});
        res.sendStatus(403);
    }
})

module.exports = router;