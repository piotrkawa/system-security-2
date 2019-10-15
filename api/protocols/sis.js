var router = require('express').Router();
const sisService = require('../../services/sisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');

router.post('/init', async function (req, res) {
    /**
    {
        'protocol_name": 'sis',
        "payload": {
            "A": "12345 67890",
            "X": "12345 67890"
        }
    }
    */
    sessions = await dbService.getAllSessions();
    let payload = req.body.payload;

    const sessionToken = utilityService.generateToken();
    const c = await sisService.generateC(); 
    payload['c'] = c;
    await dbService.saveSession(sessionToken, payload);
    res.json({'session_token': 'string', 'payload': {'c': c}});
    /**
    {
        "session_token": "string",
        "payload": {
          "c": "12345 67890"
        }
    }
    */
})


router.post('/verify', async function (req, res) {
    /**
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

    console.log('sessionToken: ' + sessionToken);
    console.log('s: ' + s);
    
    const session = await dbService.findSession(sessionToken);
    console.log(session);

    let isVerified = false;
    if (session == null) {
        res.status(403);
    } else {
        console.log('session found');
        console.log(session);
        isVerified = sisService.verifyCommitment(session.dataValues, s);
    }

    res.json({'verfied': isVerified})
    /**
    {
        "verified": true / false
    }
    */
})

module.exports = router;