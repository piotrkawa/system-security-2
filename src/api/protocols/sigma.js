const router = require('express').Router();
const dbService = require('../../services/dbService');
const sigmaService = require('../../services/sigmaService');
const { LOGGER } = require('../../../logging');


router.post('/init', async function (req, res) {
    LOGGER.log({message: `[NAXOS Init] Server's public key requested`});
    try {
        LOGGER.log({message: `[NAXOS Init] Server's public key successfully returned`});
        const response = await sigmaService.init(req.body.payload);
        res.status(200).send(response);
    } catch (e) {
        LOGGER.log({message: `[NAXOS Init] An error occured while returning server's public key`});
    }
});


router.post('/exchange', async function (req, res) {
    LOGGER.log({message: `[SIGMA Exchange] Key exchange started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[SIGMA Exchange] Payload: ${JSON.stringify(payload)}`});

    const sessionToken = req.body.session_token;

    const session = await dbService.findSession(sessionToken);
    if (session == null) {
        LOGGER.log({message: `[SIS Verify] Session for token ${sessionToken} not found`});
        res.sendStatus(403);
        return;
    }
    try {
        const response = await sigmaService.exchangeKeys(session.dataValues.payload, payload);
        res.status(200).json(response);
    } catch (e) {
        res.sendStatus(403);
    }
});

module.exports = router;