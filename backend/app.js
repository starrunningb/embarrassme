var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');
var app = express();

var FACEBOOK_APP_ID = "292800734200235"
var FACEBOOK_APP_SECRET = "7039f034e2dfb3da54de1ee0b9a25990";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback" // try to change this to something else
  },
  function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
      return done(null, profile);
      console.log("Access Token: " + accessToken);
    });
 
    console.log("Access Token: " + accessToken);
  }
));

app.configure(function() {
	app.set('port', process.env.PORT || 8000);
	app.set('views', __dirname + '/views');
	app.use(express.static(path.join(__dirname, '/public')));

	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

app.get('/index.html', function(req, res){ // changed url from '/' to '/index.html'
  res.render('index.html'); // kk
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account.html', { user: req.user });
});

app.get('/login', function(req, res){ // this will have to change to an action rather than a render
  //res.render('login', { user: req.user });
  res.redirect('/');
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] }),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/'); // changed from '/' to '/index.html'
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/'); // changed from '/' to '/index.html'
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/') // changed from '/login' to '/index'
}
