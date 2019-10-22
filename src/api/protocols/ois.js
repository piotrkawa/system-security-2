var router = require('express').Router();

const oisService = require('../../services/oisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');
const { LOGGER } = require('../../../logging');


router.post('/init', async function (req, res) {
    LOGGER.log({message: `[OIS Init] Init started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[OIS Init] Payload: ${payload}`});

    const c = await oisService.generateC();
    payload['c'] = c;
    const sessionToken = utilityService.generateToken();
    await dbService.saveSession(sessionToken, payload);
    
    const response = {'session_token': sessionToken, 'payload': {'c': c}};
    LOGGER.log({message: `[OIS Init] Reponse: ${JSON.stringify(response)}`});
    res.json(response);
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

    LOGGER.log({message: `[OIS Verify] Verify started`});
    LOGGER.log({message: `[OIS Verify] Payload: ${JSON.stringify(req.body)}`});
    const { s1, s2 } = req.body.payload;
    const sessionToken = req.body.session_token;
    const session = await dbService.findSession(sessionToken);

    if (session == null) {
        LOGGER.log({message: `[OIS Verify] Session for token ${sessionToken} not found`});
        res.sendStatus(403);
        return;
    }

    try {
        const isVerified = await oisService.verifyCommitment(session.dataValues, s1, s2);
        LOGGER.log({message: `[OIS Verify] Verified: ${isVerified}`});
        res.json({'verified': isVerified});
    } catch (e) {
        LOGGER.log({message: `[OIS Verify] Verification not successful`});
        res.sendStatus(400);
    }
})

module.exports = router;