process.env.DATABASE_URL= "sqlite://:@:/"
process.env.DATABASE_STORAGE="quiz.sqlite"
process.env.PASSWORD_ENCRYPTION_KEY= "asdfghjklzxcvbnmqwertyuiop"
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var cors = require('cors');
var routes = require('./routes/index');

var app = express();

//MW que permite a la function req.render responder a peticiones AJAX
app.use(function(req, res, next) {
  var _render = res.render;

  res.render = function(view, options, fn) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.send(options);
    }else {
      _render.call(this, view, options, fn);
    }
  }
  if(req.xhr || req.headers.accept.indexOf('json') > -1) {
    req.isAjax = true;
  }
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors());
app.use(cors());
//Autologout
app.use(function(req, res, next) {
  if(req.session.user && req.session.lastVisit) {
    if((new Date().getTime() - req.session.lastVisit) > 1000 * 60 * 20) {
      delete req.session.user;
    }
  }
  req.session.lastVisit = new Date().getTime();
  next();
});
//app.use(sessionController.autologout);


app.use(function(req, res, next) {
  if(!req.session.redir) {
    req.session.redir = '/';
  }
  if(!req.path.match(/\login|\/logout|\/image|\/user/)) {
    req.session.redir = req.path;
  }
  res.locals.session = req.session;

  next();
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;