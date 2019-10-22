var router = require('express').Router();

const sssService = require('../../services/sssService');
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
   
    LOGGER.log({message: `[SSS Verify] Verify started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[SSS Verify] Payload: ${JSON.stringify(payload)}`});

    try {
        const isValid = await sssService.verifySignature(payload);
        LOGGER.log({message: `[SSS Verify] Valid: ${isValid}`});
        res.json({'valid': isValid});
    } catch (e) {
        LOGGER.log({message: `[SSS Verify] Validation not successful`});
        res.sendStatus(403);
    }
    /*
        {
            "valid": true  / false
        } 
    */
})

module.exports = router;