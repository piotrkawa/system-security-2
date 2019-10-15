var router = require('express').Router();
const oisService = require('../../services/oisService');
const utilityService = require('../../services/utilityService');
const dbService = require('../../services/dbService');

// TODO: plug it in
router.post('/init', async function (req, res) {
    let payload = req.body.payload;
    const c = await sisService.generateC(); 
    payload['c'] = c;
    const sessionToken = 'string'; //utilityService.generateToken();
    await dbService.saveSession(sessionToken, payload);
    res.json({'session_token': sessionToken, 'payload': {'c': c}});
})


router.post('/verify', async function (req, res) {
    const { s1, s2 } = req.body.payload;


    const isVerified = oisService.verifyCommitment(session, s1, s2);
    res.json({'verified': isVerified});
})

module.exports = router;