var router = require('express').Router();
router.use('/sis', require('./sis'));

const CURRENTLY_SUPPORTED_PROTOCOLS = ['sis'];

router.get('/', function (req, res) {
    res.send(CURRENTLY_SUPPORTED_PROTOCOLS)
});

module.exports = router;