const router = require('express').Router();
const CONFIG = require('../../../config').CONFIG;


router.use('/sis', require('./sis'));

router.get('/', function (req, res) {
    res.send(CONFIG.CURRENTLY_SUPPORTED_PROTOCOLS)
});

module.exports = router;