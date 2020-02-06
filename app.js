const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
const app = express();

const { LOGGER } = require('./logging');
const { CONFIG } = require('./config');

var argv = (process.argv.slice(2));
let server;
let communicate;

app.use(morgan('common'))
app.use(bodyParser.json());
app.use(require('./src/api/'));
app.use(express.json());


// new OpenApiValidator({
//     apiSpec: require('./openapi/openapi.json'),
//     validateRequests: true,
//     validateResponses: true,
// }).install(app);

// app.use((err, req, res, next) => {
//     res.status(err.status || 500).json({
//         message: err.message,
//         errors: err.errors,
//     }); 
// });


let PORT = CONFIG.HTTPS_PORT;

if (argv.includes('--https')) {
    const https = require('https');
    const credentials = require('./credentials');
    server = https.createServer(credentials, app);
    communicate = `[Server Start] HTTPS Server listening on port ${PORT}!`;
} else {
    PORT = CONFIG.HTTP_PORT;
    const http = require('http');
    server = http.createServer(app);
    communicate = `[Server Start] HTTP Server listening on port ${PORT}!`;
}

server.listen(PORT, function() {
    LOGGER.log({message: `${communicate}`})
});

module.exports = app
