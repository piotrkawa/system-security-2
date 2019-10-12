var router = require('express').Router();

const CURRENTLY_SUPPORTED_PROTOCOLS = ['sis'];

router.get('/', function (req, res) {
    res.send(CURRENTLY_SUPPORTED_PROTOCOLS)
});

router.post('/init', (req, res)=> res.send(null))
router.post('/verify', (req, res)=> res.send(null))

module.exports = router;