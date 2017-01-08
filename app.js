var express = require('express'),
    sassMiddleware = require('node-sass-middleware'),
    path    = require('path'),
    favicon = require('serve-favicon'),
    logger  = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser    = require('body-parser');

// Routes
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(
  favicon(path.join(__dirname, 'public', 'favicon.ico'))
);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/stylesheets'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

app.use(
  express.static(path.join(__dirname, 'public'))
);

//  Connect all our routes to our application
app.use('/', routes);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
