const express = require('express');
const Router = express.Router();

const workRouter = require('./user')
const workRouter = require('./ws')

Router.use('/users',userRouter);
Router.use('/workspace',workRouter);

module.exports = Router;