
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var request1 = require('request');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var Greet= ['Hi there. I am Deary, how can I help you?', 'Hi. I am Deary, how can I help you?', 'Hello. I am Deary, how can I help you', 'Hey. I am Deary, how can I help you']; 
var Maintenance= ['Oh! Sorry for the inconvenience, maintenance engineer will be attending your issue soon', 'Issue has been logged, your problem will be fixed soon', 'Sad about it! will take care of this problem', 'I feel sorry for that, your issue will be attended soon'];
var Emergency= ['I can help you with that', 'Calling 911..', 'I can reach out to your emergency contact', 'Take care, Contacting your doctor'];
var Weather= ['It is cold/ hot/windy/rainy today', 'It is 54o, likely to rain tonight', 'Sunrise is at 5=30 AM today'];
var Useless= ['I never really thought about it', 'hmm..', 'Ok, How can I help you with that', 'This is not for what I am here', 'I don’t think I can explain it', 'I wouldn’t worry about it'];
var Bye= [ 'Bye', ' See you, It’s been a pleasure', 'Ok, see you later', 'You too. Bye', 'Bye bye!', 'Have a good one', 'All right then'];

app.get('/', routes.index);
app.get('/users', user.list);
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io')(server);
io.on('connect', function(socket){
	var input = "I can't get that!";  
	console.log('a user connected');
	  socket.on('chat message', function(msg){
		  console.log('message from client: ' + msg);
		  request1("http://54.172.196.198:5000/classify?sentence="+msg, function (error, response, body) {
				console.log('error:', error); // Print the error if one occurred 
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
				console.log('body:', body); // Print the HTML for the Google homepage. 
				if(body == 'useless'){
					input = Useless[Math.floor(Math.random() * Useless.length)];
				}
				else if(body == 'DearyWeather'){
					input = Weather[Math.floor(Math.random() * Weather.length)];
				}
				else if(body == 'DearyMaint'){
					input = Maintenance[Math.floor(Math.random() * Maintenance.length)];
				}
				else if(body == 'DearyEmergency'){
					input = Emergency[Math.floor(Math.random() * Emergency.length)];
				}
				else if(body == 'DearyBye'){
					input = Bye[Math.floor(Math.random() * Bye.length)];
				}
				else if(body == 'DearyGreet'){
					input = Greet[Math.floor(Math.random() * Greet.length)];
				}
			  	else if(body == ""){
					input = 'I couldn\'t get that!';
				}
			  	else{
					input = 'I couldn\'t get that!';
				}
				socket.on('disconnect', function(){
				    console.log('user disconnected');
				  });
				var r = msg+"  :  "+body;
				socket.emit('chat message', r);
				console.log("Replied: "+body);
			});
		    
		  
		  });
	
	  
	});
	
