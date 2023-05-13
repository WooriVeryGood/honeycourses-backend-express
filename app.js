const express = require('express');
const logger = require('morgan');
const coursesRouter = require('./routes/courses');
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: 'https://honeycourses.com'
};

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', coursesRouter); // add your API routes here

module.exports = app;
