const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

const app = express();
const PORT = 8080;
var argv = (process.argv.slice(2));
let server;
let communicate;

app.use(morgan('common'))
app.use(bodyParser.json());
app.use(require('./src/api'));
app.use(express.json());


new OpenApiValidator({
    apiSpec: require('./openapi/openapi.json'),
    validateRequests: true,
    validateResponses: true,
}).install(app);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    }); 
});

if (argv.includes('--https')) {
    const https = require('https');
    const credentials = require('./credentials');
    server = https.createServer(credentials, app);
    communicate = `HTTPS Server listening on port ${PORT}!`;
} else {
    const http = require('http');
    server = http.createServer(app);
    communicate = `HTTP Server listening on port ${PORT}!`;
}

server.listen(PORT, function() {
    console.log(communicate)
    app.emit('app_started');
});

module.exports = app
