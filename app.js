const express = require('express');
const logger = require('morgan');
const coursesRouter = require('./routes/courses');
const cors = require("cors");


const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', coursesRouter); // add your API routes here


module.exports = app;
