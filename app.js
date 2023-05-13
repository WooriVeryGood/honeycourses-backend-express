const chalk = require('chalk')
const express = require('express');
const logger = require('morgan');
const coursesRouter = require('./routes/courses');
const cors = require("cors");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);


const app = express();

const corsOptions = {
  origin: 'https://honeycourses.com'
};

const morganMiddleware = logger(function (tokens, req, res) {
  return [
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    chalk.hex('#ffb142').bold(tokens.status(req, res)),
    chalk.hex('#ff5252').bold(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
    chalk.hex('#f78fb3').bold('@ ' + dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')),
    chalk.yellow(req.ip),
    chalk.hex('#fffa65').bold('from ' + tokens.referrer(req, res)),
    chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
    '\n',
  ].join(' ');
});

app.set('trust proxy', true);

app.use(morganMiddleware);

// app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', coursesRouter); // add your API routes here

app.use('/api/*', function(req, res) {
  res.status(403).send('Access forbidden.');
});

module.exports = app;
