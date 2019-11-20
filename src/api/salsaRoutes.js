const express = require('express')
const router = express.Router()
const standardRoutes = require('./routes')

const encryptDecryptMiddleware = async function(req, res, next){
    let oldSend = res.send;
    console.log('iksde')
    // console.log(res.send)
    req.body['yeee'] = 1
    res.send = function(data) {
        // TODO res.json -> res.send
        // if data is string - serialize to json
        if (typeof data === 'string') {
            data = JSON.stringify(data);
        }

        data['chuj'] = 'chuj';
        oldSend.apply(res, arguments)
    }
    next();
};


router.use(encryptDecryptMiddleware, standardRoutes);

module.exports = router