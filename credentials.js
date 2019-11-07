const fs = require('fs');

const privateKey  = fs.readFileSync('./assets/credentials/privkey.pem');
const certificate = fs.readFileSync('./assets/credentials/cert.pem');
const chain = fs.readFileSync('./assets/credentials/fullchain.pem');
const credentials = { key: privateKey, cert: certificate, ca: chain };

module.exports = credentials
