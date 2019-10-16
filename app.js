const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

const app = express();
const port = 3000;

app.use(morgan('common'))
app.use(bodyParser.json());
app.use(require('./src/api'));
app.use(express.json());


new OpenApiValidator({ // TODO: enable validation
    apiSpec: require('./openapi/api.json'),
    validateRequests: true, // (default)
    validateResponses: true, // false by default
}).install(app);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.listen(port);
module.exports = app