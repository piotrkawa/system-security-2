// TODO: import Session model


function saveSession(token, payload) {
    Session.create({ token: token, payload: payload});
}

function findSession(sessionToken) {
    Session.findOne({
        where: {
           token: sessionToken
        }
     }).then(function(session) {
        if (!session) {
            return null;
        }
        return session.dataValues;
     });
}

module.exports = { saveSession, findSession }