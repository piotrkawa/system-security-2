const router = require('express').Router();

router.use('/protocols', require('./routes'));
router.use('/salsa/protocols', require('./salsaRoutes'));
router.use('/chacha/protocols', require('./chachaRoutes'));

module.exports = router; 