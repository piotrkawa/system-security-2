const router = require('express').Router();

const sigmaService = require('../../services/sigmaService');
const { LOGGER } = require('../../../logging');


router.post('/init', async function (req, res) {
    LOGGER.log({message: `[NAXOS Init] Server's public key requested`});
    try {
        LOGGER.log({message: `[NAXOS Init] Server's public key successfully returned`});
        const response = sigmaService.init(req.body.payload);
        res.status(200).send(response);
    } catch (e) {
        LOGGER.log({message: `[NAXOS Init] An error occured while returning server's public key`});
    }
});


router.post('/exchange', async function (req, res) {
    LOGGER.log({message: `[SIGMA Exchange] Key exchange started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[SIGMA Exchange] Payload: ${JSON.stringify(payload)}`});

    try {

    const sessionToken = req.body.session_token;

    const session = await dbService.findSession(sessionToken);
    if (session == null) {
        LOGGER.log({message: `[SIS Verify] Session for token ${sessionToken} not found`});
        res.sendStatus(403);
        return;
    }
    try {
        const isVerified = await sigmaService.exchangeKeys(session.dataValues, payload);
        // LOGGER.log({message: `[SIS Verify] Verified: ${isVerified}`});
        // if (isVerified) {
        //     res.status(200).json({'verified': isVerified});
        // } else {
        //     res.status(403).json({'verified': isVerified});
        // }
    } catch (e) {
        LOGGER.log({message: `[SIS Verify] Verification not successful`});
        res.sendStatus(403);
    }
});

module.exports = router;