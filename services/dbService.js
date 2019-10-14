const models = require('../models');

async function saveSession(token, payload) {
    models.Session.create({ token: token, payload: payload});
}

function findSession(sessionToken) {
    console.log(sessionToken);
    models.Session.findOne({
        where: {
           token: sessionToken
        }
     }).then(function(session) {
        
        if (!session) {
            console.log('false')
            return null;
        }
        console.log('TRUE')
        return session;
     });
}

module.exports = { saveSession, findSession }