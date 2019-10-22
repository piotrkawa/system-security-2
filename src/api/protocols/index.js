const router = require('express').Router();
const CONFIG = require('../../../config').CONFIG;


router.use('/sis', require('./sis'));
router.use('/ois', require('./ois'));
router.use('/sss', require('./sss'));
router.use('/msis', require('./msis'));

router.get('/', function (req, res) {
    res.send({'schemas': CONFIG.CURRENTLY_SUPPORTED_PROTOCOLS})
});

module.exports = router;