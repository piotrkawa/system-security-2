const privateKey  = fs.readFileSync('credentials/server.key', 'utf8');
const certificate = fs.readFileSync('credentials/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

module.exports = credentials
