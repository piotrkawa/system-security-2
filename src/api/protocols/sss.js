var router = require('express').Router();
const sssService = require('../../services/sssService');
const dbService = require('../../services/dbService');


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
    // try {
    let payload = req.body.payload;
    const isVerified = await sssService.verifyCommitment(payload);
    res.json({'verified': isVerified});
    // } catch (e) {
        // res.sendStatus(400);
    // }
    /*
        {
            "verified": true  / false
        } 
    */
})

module.exports = router;