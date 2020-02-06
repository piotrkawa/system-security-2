const router = require('express').Router();
const CONFIG = require('../../config').CONFIG;
const { LOGGER } = require("../../logging");

router.use('/sis', require('./protocols/sis'));
router.use('/ois', require('./protocols/ois'));
router.use('/sss', require('./protocols/sss'));
router.use('/msis', require('./protocols/msis'));
router.use('/blsss', require('./protocols/blsss'));
router.use('/gjss', require('./protocols/gjss'));
router.use('/naxos', require('./protocols/naxos'));
router.use('/sigma', require('./protocols/sigma'));

router.get('/', function (req, res) {
    LOGGER.log({message: `[PROTOCOLS LIST] Request for protocols list`});
    res.send({'schemas': CONFIG.CURRENTLY_SUPPORTED_PROTOCOLS})
    LOGGER.log({message: `[PROTOCOLS LIST] Protocols list successfully returned`});
});

module.exports = router;