require("dotenv").config();
const express = require('express');
const cors = require('cors');
const MainRouter = require('./routes/index')
const PORT = process.env.PORT

const app = express();

app.use('/api',MainRouter);

app.use(cors());
app.use(express.json());

app.listen(PORT)