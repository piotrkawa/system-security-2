const router = require('express').Router();

const blsssService = require('../../services/blsssService');
const { LOGGER } = require('../../../logging');


router.post('/verify', async function (req, res) {
    LOGGER.log({message: `[BLSSS Verify] Verify started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[BLSSS Verify] Payload: ${JSON.stringify(payload)}`});

    try {
        const isValid = await blsssService.verifySignature(payload);
        LOGGER.log({message: `[BLSSS Verify] Valid: ${isValid}`});
        res.send({'valid': isValid});
    } catch (e) {
        LOGGER.log({message: `[BLSSS Verify] Validation not successful`});
        res.sendStatus(403);
    }
})

module.exports = router;