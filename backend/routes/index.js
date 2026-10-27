const express = require('express');
const Router = express.Router();

const userRouter = require('./user')
const projectRouter = require('./project')

Router.use('/users',userRouter);
Router.use('/projects',projectRouter);
// Router.use('/members',workRouter);
// Router.use('/tasks',workRouter);

module.exports = Router;