var router = require('express').Router();
const sisService = require('../../services/sisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');


router.post('/init', async function (req, res) {
    /*
    {
        'protocol_name": 'sis',
        "payload": {
            "A": "12345 67890",
            "X": "12345 67890"
        }
    }
    */
    let payload = req.body.payload; // TODO: move to apiService.js
    const c = await sisService.generateC(); 
    payload['c'] = c;
    const sessionToken = utilityService.generateToken();
    await dbService.saveSession(sessionToken, payload);
    res.json({'session_token': sessionToken, 'payload': {'c': c}});
    /*
    {
        "session_token": "string",
        "payload": {
          "c": "12345 67890"
        }
    }
    */
})


router.post('/verify', async function (req, res) {
    /*
        {
            "protocol_name": "sis",
            "session_token": "string",
            "payload": {
                "s": "12345 67890"
            }
        }
    */
    const sessionToken = req.body.session_token;
    const s = req.body.payload.s;
    const session = await dbService.findSession(sessionToken);

    if (session == null) {
        // log: session not found
        res.sendStatus(403);
        return;
    }

    try {
        const isVerified = await sisService.verifyCommitment(session.dataValues, s);
        if (isVerified === true) {
            res.status(200).json({'verified': isVerified});
        } else {
            res.status(403).json({'verified': isVerified});
        }
        
    } catch (e) {
        res.sendStatus(403);
    }
    /*
    {
        "verified": true / false
    }
    */
})

module.exports = router;