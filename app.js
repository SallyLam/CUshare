/*
  CUshare Resource Sharing Platform

  CUshare allow CUers conveniently share their personal items (such as used textbooks) with each other.
  User can issue sell request, buy request, or even exchange request if needed on CUshare.
  People with corresponding needs can respond to the request and settle down time/location
  of the sharing with you directly on the website.

  @category   View
  @author     Xinyu (Cynric) Fu     <xyfu6@cse.cuhk.edu.hk>
  @author     Zhanhao (Jasper) Liu  <zhliu6@cse.cuhk.edu.hk>
  @author     Shinmin (Sally) lin   <smlin6@cse.cuhk.edu.hk>
  @author     Jiamin (Vito) Chen    <jmchen6@cse.cuhk.edu.hk>

  @copyright  2018 CSCI4140 Group 1
  @license    https://opensource.org/licenses/MIT
  @version    1.2.0 5-5-2018
  @link       https://github.com/SallyLam/CUshare
*/


// Load required modules.
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');

// Initialize mongoose and connect to MongoDB.
global.dbHelper = require( './common/dbHelper' );
global.db = mongoose.connect("mongodb://127.0.0.1:27017/test1");

// Set the port that this nodejs server will listen to
app.set('port', process.env.PORT || 3000)

// Set the directory where html (template) files reside.
app.set('views', path.join(__dirname, 'views'));
// Set the web template engine as 'html',
// to let res.render('xx.html') => res.render('xx').
app.set( 'view engine', 'html' );
// Register EJS template engine to '.html' files,
// i.e. map '.html' files to the EJS template engine.
app.engine( '.html', require( 'ejs' ).__express );

// Set static files' directory as './views', where resource files (images, js, etc.) reside.
app.use(express.static(path.join(__dirname, 'views')));
// Add a session middle ware, for recording users' login status.
app.use(session({
  resave: true,
  saveUninitialized:true,
  secret:'secret',
  cookie:{
    maxAge:1000*60*30
  }
}));
// Add bodyParser and multer middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());
// Add a middleware for sending error messages to client sides.
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var err = req.session.error;
  res.locals.errMessage = '';
  if (err) res.locals.errMessage = '<div class="alert alert-danger alert-dismissable" style="margin-bottom: 20px;color:red;">' +
  '<a class="panel-close close" data-dismiss="alert">x</a><i class="fa fa-coffee"></i>' +  err + '</div>';
  next();
});
// Add a middleware for sending notification messages to client sides.
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var noti = req.session.notification;
  res.locals.notiMessage = '';
  if (noti) res.locals.notiMessage = '<div class="alert alert-info alert-dismissable">' +
  '<a class="panel-close close" data-dismiss="alert">x</a><i class="fa fa-coffee"></i>' + noti + '</div>';
  next();
});

// Require ./routes/index.js by default
// indes.js exports a function that further requires other js files.
require('./routes')(app);

// Respond a GET request for the homepage.
app.get('/', function(req, res) {
  if (req.session.user) {
    res.render('home', { "isLogin": true, "firstname": req.session.user.firstname });
  } else {
    res.render('home', { "isLogin": false });
  }
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
