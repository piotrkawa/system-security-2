const express = require('express');
const bodyParser = require('body-parser');
var morgan = require('morgan')

const app = express();
const port = 3000;

app.use(morgan('common'))
app.use(bodyParser.json());
app.use(require('./api'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
