const express = require('express');
const logger = require('morgan');
const coursesRouter = require('./routes/courses');
const cors = require("cors");

const app = express();

app.use(logger('dev'));
app.use(cors({
  origin: 'https://honeycourses.com'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', coursesRouter);

// Add error handling middleware to catch unauthorized requests
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = app;
