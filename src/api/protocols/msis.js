const router = require('express').Router();

const msisService = require('../../services/msisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');
const { LOGGER } = require('../../../logging');


router.post('/init', async function (req, res) {
    LOGGER.log({message: `[MSIS Init] Init started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[MSIS Init] Payload: ${JSON.stringify(payload)}`});

    const c = msisService.generateC(); 
    payload['c'] = c;
    const sessionToken = utilityService.generateToken();
    await dbService.saveSession(sessionToken, payload);

    const response = {'session_token': sessionToken, 'payload': {'c': c}};
    LOGGER.log({message: `[MSIS Init] Reponse: ${JSON.stringify(response)}`});
    res.send(response);
})


router.post('/verify', async function (req, res) {
    LOGGER.log({message: `[MSIS Verify] Verify started`});
    LOGGER.log({message: `[MSIS Verify] Payload: ${JSON.stringify(req.body)}`});
    const sessionToken = req.body.session_token;
    const S = req.body.payload.S;

    const session = await dbService.findSession(sessionToken);

    if (session == null) {
        // log: session not found
        res.sendStatus(403);
        return;
    }

    try {
        const isVerified = await msisService.verifyCommitment(session.dataValues, S);
        LOGGER.log({message: `[MSIS Verify] Verified: ${isVerified}`});
        if (isVerified) {
            res.status(200).json({'verified': isVerified});
        } else {
            res.status(403).json({'verified': isVerified});
        }
    } catch (e) {
        LOGGER.log({message: `[MSIS Verify] Verification not successful - ${e}`});
        res.sendStatus(403);
    }
    /*
    {
        "verified": true / false
    }
    */
})

module.exports = router;