const models = require('../models');
const { LOGGER } = require('../../logging');

async function saveSession(token, payload) {
    await models.Session.create({ token: token, payload: payload});
    LOGGER.log({message: `Session saved`});
}

const findSession = async function (sessionToken) {
    const session = await models.Session.findOne({
        where: {
           token: sessionToken
        }
     })
    return !session ? null : session; 
}


const getAllSessions = async function () {
    const sessions = await models.Session.findAll();
    return !sessions ? null : sessions; 
}

module.exports = { saveSession, findSession, getAllSessions }