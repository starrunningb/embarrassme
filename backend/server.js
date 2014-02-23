var http = require('http');
var express = require('express');
var passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;
var app = express();
var server = http.createServer(app);

app.configure(function(){
	app.set('port', process.env.PORT || 8000);
	app.set('views', __dirname + '/views');
});

app.get('/', function(req, res){
	res.sendfile('templates/index3.html');
});

server.listen(app.get('port'), function(){
	console.log("Listening on port " + app.get('port'));
});
