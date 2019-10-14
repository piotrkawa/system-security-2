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
    
    let payload = req.body.payload;

    const sessionToken = utilityService.generateToken();
    const c = sisService.generateC(); 
    payload['c'] = c;
    
    await dbService.saveSession(sessionToken, payload); // TODO: race condition!!!!!!!!!!!
    let ses = await dbService.findSession(sessionToken);

    if (ses == null) {
        console.log('Not Found')
    } else {
        console.log(ses)
    }

    res.json({'session_token': sessionToken, 'payload': {'c': c}});
    /**
    {
        "session_token": "string",
        "payload": {
          "c": "12345 67890"
        }
    }
    */
})


router.post('/verify', function (req, res) {
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
    
    const session = dbService.findSession(sessionToken); // TODO: why is { undefined } 
    console.log(session);

    let isVerified = false;
    if (session == null) {
        console.log('session NOT found');
        res.status(403);
    } else {
        console.log('session found');
        isVerified = sisService.verifyCommitment(session, s);
    }

    res.json({'verfied': isVerified})
    /**
    {
        "verified": true / false
    }
    */
})

module.exports = router;