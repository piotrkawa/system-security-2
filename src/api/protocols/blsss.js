var router = require('express').Router();

const blsssService = require('../../services/blsssService');
const { LOGGER } = require('../../../logging');


router.post('/verify', async function (req, res) {
    /*
        {
            "protocol_name": "sss",
            "payload": {
                "s": "12345 67890",
                "X": "12345 67890",
                "A": "12345 67890",
                "msg": "Test message"
            }
        }
    */
   
    LOGGER.log({message: `[BLSSS Verify] Verify started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[BLSSS Verify] Payload: ${JSON.stringify(payload)}`});

    try {
        const isValid = await blsssService.verifySignature(payload);
        LOGGER.log({message: `[BLSSS Verify] Valid: ${isValid}`});
        res.json({'valid': isValid});
    } catch (e) {
        LOGGER.log({message: `[BLSSS Verify] Validation not successful`});
        res.sendStatus(403);
    }
    /*
        {
            "valid": true  / false
        } 
    */
})

module.exports = router;