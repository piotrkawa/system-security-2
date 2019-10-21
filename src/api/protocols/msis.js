var router = require('express').Router();
const msisService = require('../../services/msisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');


router.post('/init', async function (req, res) {
    /*
    {
        'protocol_name": 'msis',
        "payload": {
            "A": "12345 67890",
            "X": "12345 67890"
        }
    }
    */
    let payload = req.body.payload;
    const c = await msisService.generateC(); 
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
            "protocol_name": "msis",
            "session_token": "string",
            "payload": {
                "S": "12345 67890"
            }
        }
    */
    const sessionToken = req.body.session_token;
    const S = req.body.payload.S;
    const session = await dbService.findSession(sessionToken);

    if (session == null) {
        // log: session not found
        res.sendStatus(403);
        return;
    }

    // try {
    const isVerified = await msisService.verifyCommitment(session.dataValues, S);
    res.json({'verified': isVerified})
    // } catch (e) {
        // console.log(e);
        // res.sendStatus(403);
    // }
    /*
    {
        "verified": true / false
    }
    */
})

module.exports = router;