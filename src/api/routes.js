const router = require('express').Router();
const CONFIG = require('../../config').CONFIG;


router.use('/sis', require('./protocols/sis'));
router.use('/ois', require('./protocols/ois'));
router.use('/sss', require('./protocols/sss'));
router.use('/msis', require('./protocols/msis'));
router.use('/blsss', require('./protocols/blsss'));
router.use('/gjss', require('./protocols/gjss'));
router.use('/naxos', require('./protocols/naxos'));
router.use('/sigma', require('./protocols/sigma'));

router.get('/', function (req, res) {
    res.send({'schemas': CONFIG.CURRENTLY_SUPPORTED_PROTOCOLS})
});

module.exports = router;