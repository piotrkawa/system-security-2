var router = require('express').Router();

const naxosService = require('../../services/naxosService');
const { LOGGER } = require('../../../logging');


router.post('/exchange', async function (req, res) {
    /*
        {
            "protocol_name": "naxos",
            "payload": {
                "X": "12345 67890",
                "A": "12345 67890",
                "msg": "Test Message" (length of 64)
            }
        }
    */
    // TODO: update API docs
    LOGGER.log({message: `[NAXOS Exchange] Key exchange started`});
    let payload = req.body.payload;
    LOGGER.log({message: `[NAXOS Exchange] Payload: ${JSON.stringify(payload)}`});

    try {
        // TODO: implement
    } catch (e) {
        LOGGER.log({message: `[NAXOS Exchange] Key exchange not successful`});
        res.sendStatus(403);
    }
    /*
        {
            "Y": "12345 67890",
            "msg": "" base64(sha3_512(K | msg))
        } 
    */
});

router.get('/pkey', async function (req, res) {
    LOGGER.log({message: `[NAXOS Pkey] Server's public key requested`});

    try {
        LOGGER.log({message: `[NAXOS Pkey] Server's public key successfully returned`});

    } catch (e) {
        LOGGER.log({message: `[NAXOS Pkey] An error occured while returning server's public key`});
    }
    /*
        {
            "B": "12345 67890"
        } 
    */
});

module.exports = router;