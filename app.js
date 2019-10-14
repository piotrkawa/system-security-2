const express = require('express');
const models = require('./models');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(require('./api'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
