const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const args = process.argv.slice(2);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({
  secret: 'aptgamestempsecret123',
  cookie: {expires: new Date(253402300000000)},  // cookie never expire
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const event = require('./routes/event/event');
const event_api = require('./routes/event/event_api');
//const event_db = require("./server/event_db");
app.use('/event', event);
app.use('/event', event_api);

const index = require('./routes/index/index');
const index_api = require('./routes/index/index_api');
//const index_db = require("./server/index_db");
app.use('/', index);
app.use('/', index_api);

const project = require('./routes/project/project');
const project_api = require('./routes/project/project_api');
//const project_db = require('./server/project_db');
app.use('/project', project);
app.use('/project', project_api);

const proposal = require('./routes/proposal/proposal');
const proposal_api = require('./routes/proposal/proposal_api');
//const proposal_db = require('./server/proposal_db');
app.use('/proposal', proposal);
app.use('/proposal', proposal_api);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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


if (process.env.INSTALL === 'yes' || args[0] === 'install') {
  db.reset(function (err) {
    if (err)
      console.log(err);
  });
}

module.exports = app;
