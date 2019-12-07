const router = require('express').Router();

const naxosService = require('../../services/naxosService');
const mclService = require('../../services/mclService');
const { LOGGER } = require('../../../logging');


router.get('/pkey', async function (req, res) {
    LOGGER.log({message: `[NAXOS Pkey] Server's public key requested`});
    try {
        const B = mclService.getPublicKey();
        const response = {
            B: B.getStr().slice(2),
        }
        LOGGER.log({message: `[NAXOS Pkey] Server's public key successfully returned`});
        res.status(200).send(response);
    } catch (e) {
        LOGGER.log({message: `[NAXOS Pkey] An error occured while returning server's public key`});
    }
});


router.post('/exchange', async function (req, res) {
    let payload = req.body.payload;
    LOGGER.log({message: `[NAXOS Exchange] Key exchange started, payload: ${JSON.stringify(payload)}`});

    try {
        const response = naxosService.exchangeKeys(payload);
        LOGGER.log({message: `[NAXOS Exchange] Key exchange successful`});
        res.send(response);
    } catch (e) {
        LOGGER.log({message: `[NAXOS Exchange] Key exchange not successful`});
        res.sendStatus(403);
    }
});

module.exports = router;