require("dotenv").config();
const express = require('express');
const cors = require('cors');
const MainRouter = require('./routes/index')
const PORT = process.env.PORT

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1',MainRouter);

app.listen(PORT)