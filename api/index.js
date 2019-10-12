var router = require('express').Router();

router.use('/protocols', require('./protocols'));

module.exports = router;