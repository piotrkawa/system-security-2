const express = require('express')
const app = express()
const port = 3000
app.use(require('./api'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`))