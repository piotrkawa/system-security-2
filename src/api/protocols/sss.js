var router = require('express').Router();
const sssService = require('../../services/oisService');
const utilityService = require('../../services/utilityService');
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

    const { s1, X, A, msg } = req.body.payload;
    const session = await dbService.findSession(sessionToken);

    if (session == null) {
        // log: session not found
        res.sendStatus(403);
        return;
    }

    try {
        const isVerified = await oisService.verifyCommitment(session.dataValues, s1, s2);
        res.json({'verified': isVerified});
    } catch (e) {
        res.sendStatus(400);
    }
    /*
        {
            "verified": true  / false
        } 
    */
})

module.exports = router;