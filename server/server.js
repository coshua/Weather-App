const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api = require('./routes/index');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use('/api', api);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));