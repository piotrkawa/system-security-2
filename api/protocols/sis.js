var router = require('express').Router();
const sisService = require('../../services/sisService');
const utilityService = require('../../services/utilityService');


router.post('/init', function (req, res) {
    /**
    {
        'protocol_name": 'sis',
        "payload": {
            "A": "12345 67890",
            "X": "12345 67890"
        }
    }
    */
    // TODO: checking 
    let payload = req.body.payload;

    const sessionToken = utilityService.generateToken();
    const c = sisService.generateC(); 
    payload['c'] = c;
    // dbService.saveSession(sessionToken, payload);
    console.log(payload)


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
    const sessionToken = req.body.payload.session_token;
    const s = req.body.payload.s;

    console.log(sessionToken);
    console.log(s);
    
    const session = dbService.findSession(sessionToken);

    if (session == null) {
        // TODO: SESSION NOT FOUND OR STH LIKE THATH

    }

    const isVerified = sisService.verifyCommitment(session, s);
    
    res.json({'verfied': isVerified})
    /**
    {
        "verified": true / false
    }
    */
})

module.exports = router;