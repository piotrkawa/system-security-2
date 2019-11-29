const router = require('express').Router();

const sisService = require('../../services/sisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');
const { LOGGER } = require('../../../logging');


router.post('/init', async function (req, res) {
    LOGGER.log({message: `[SIS Init] Init started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[SIS Init] Payload: ${JSON.stringify(payload)}`});

    const c = sisService.generateC();
    payload['c'] = c;
    const sessionToken = utilityService.generateToken();
    await dbService.saveSession(sessionToken, payload);

    const response = {'session_token': sessionToken, 'payload': {'c': c}};
    LOGGER.log({message: `[SIS Init] Reponse: ${JSON.stringify(response)}`});
    res.send(response);
})


router.post('/verify', async function (req, res) {
    LOGGER.log({message: `[SIS Verify] Verify started`});
    LOGGER.log({message: `[SIS Verify] Payload: ${JSON.stringify(req.body)}`});
    const sessionToken = req.body.session_token;
    const s = req.body.payload.s;

    const session = await dbService.findSession(sessionToken);

    if (session == null) {
        LOGGER.log({message: `[SIS Verify] Session for token ${sessionToken} not found`});
        res.sendStatus(403);
        return;
    }

    try {
        const isVerified = await sisService.verifyCommitment(session.dataValues, s);
        LOGGER.log({message: `[SIS Verify] Verified: ${isVerified}`});
        if (isVerified) {
            res.status(200).json({'verified': isVerified});
        } else {
            res.status(403).json({'verified': isVerified});
        }
    } catch (e) {
        LOGGER.log({message: `[SIS Verify] Verification not successful`});
        res.sendStatus(403);
    }
    /*
    {
        "verified": true / false
    }
    */
})

module.exports = router;