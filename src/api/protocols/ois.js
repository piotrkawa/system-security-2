var router = require('express').Router();
const oisService = require('../../services/oisService');
const sisService = require('../../services/sisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');

// TODO: plug it in
router.post('/init', async function (req, res) {
    let payload = req.body.payload;
    const c = await oisService.generateC(); 
    payload['c'] = c;
    const sessionToken = utilityService.generateToken();
    await dbService.saveSession(sessionToken, payload);
    res.json({'session_token': sessionToken, 'payload': {'c': c}});
})


router.post('/verify', async function (req, res) {
    /*
        {
            "protocol_name": "ois",
            "session_token": "string",
            "payload": {
                "s1": "12345 67890",
                "s2": "12345 67890"
            }
        }
    */

    const { s1, s2 } = req.body.payload;
    const sessionToken = req.body.session_token;
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
        console.log('[ERROR] '+ e)
        res.sendStatus(400);
    }
    finally {
        return;
    }
})

module.exports = router;