const router = require('express').Router();
const dbService = require('../../services/dbService');
const sigmaService = require('../../services/sigmaService');
const { LOGGER } = require('../../../logging');


router.post('/init', async function (req, res) {
    LOGGER.log({message: `[NAXOS Init] Server's public key requested`});
    try {
        const response = await sigmaService.init(req.body.payload);
        LOGGER.log({message: `[NAXOS Init] Server's public key successfully returned`});
        res.status(200).send(response);
    } catch (e) {
        LOGGER.log({message: `[NAXOS Init] An error occured while returning server's public key`});
    }
});


router.post('/exchange', async function (req, res) {
    let payload = req.body.payload;
    LOGGER.log({message: `[SIGMA Exchange] Key exchange started, payload: ${JSON.stringify(payload)}`});
    const sessionToken = req.body.session_token;

    const session = await dbService.findSession(sessionToken);
    if (session == null) {
        LOGGER.log({message: `[SIGMA Exchange] Session for token ${sessionToken} not found`});
        res.sendStatus(403);
        return;
    }

    try {
        const response = await sigmaService.exchangeKeys(session.dataValues.payload, payload);
        LOGGER.log({message: `[SIGMA Exchange] Key exchange successful`});
        res.status(200).json(response);
    } catch (e) {
        LOGGER.log({message: `[SIGMA Exchange] Key exchange not successful`});
        res.sendStatus(403);
    }
});

module.exports = router;