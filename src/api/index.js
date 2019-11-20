const router = require('express').Router();

router.use('/protocols', require('./routes'));
router.use('/salsa/protocols', require('./salsaRoutes'));

module.exports = router;