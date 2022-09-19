var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ResponseMicros = require('./Macros/ResponseMicros');
const mongoose = require("mongoose");
const schedule = require('node-schedule');
var fs = require('fs');
var router = express.Router();
const employeesDetails = require('./controllers/employeesDetails');
//for use env varables
require('dotenv').config();
const env = process.env;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
ResponseMicros.response(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send("Hello Safe Care");
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const url = env.DB_CLOUD;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(`Successfully Connected to ${url}`));


const main = async () => {
  console.log(`Listening at port ${env.PORT}`);
 
  // PREVENT CORS ERROR /
  // API.use(cors());
  app.use((req, res, next) => {
    const domain = ["http://localhost:3000/","https://safe-care-api.herokuapp.com"];

    console.log(req.header('Origin'));
    res.status(200);
    if (domain.indexOf(req.header('Origin')) !== -1) {
      res.header("Access-Control-Allow-Origin", req.header('Origin'));
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
    } else {
      res.header("Access-Control-Allow-Origin", "");
      res.header("Access-Control-Allow-Headers", "");
      res.header("Access-Control-Allow-Methods", "");
    }
    next();
  });
};

app.listen(env.PORT || 3000, main);
// app.listen(env.PORT, () => {
//   console.log(`Example app listening at http://localhost:${env.PORT}`)
// })

const someDate = new Date('');
schedule.scheduleJob('01 12 1 * *', () => {
  employeesDetails.generatePdf();
  console.log("done email");
});

module.exports = app;
