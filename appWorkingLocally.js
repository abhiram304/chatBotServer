
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');
var server = require('websocket').server;
var app = express();
var request1 = require('request');
//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


var socket = new server({
	httpServer: http.createServer(app).listen(1337,function(){
		console.log("Server Listening ");
	})
});

/*io.on('connection', function(socket){
	  socket.emit('request',  ); // emit an event to the socket 
	  io.emit('broadcast',  ); // emit an event to all connected sockets 
	  socket.on('reply', function(){   }); // listen to the event 
	});
*/

socket.on('request', function(request) {
	var connection = request.accept(null, request.origin);

	connection.on('message', function(message) {
		var input = message.utf8Data;
		console.log("Message from client: "+message.utf8Data);
		//comments=['Missed to field','Classic Text Book Shot','Hat trick','Classical Shot','Unbelievable miss','Out of the stadium!'];
		//Request url for the classifier on ec2
		var url = "ec2-34-207-241-247.compute-1.amazonaws.com:5000/classify?sentence="+input;		
		/*var options = {
				host: url,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
		};
		//var prot = options.port == 443 ? https : http;
		var req = http.request(options, function(res)
				{
			var output = '';
			console.log(options.host + ':' + res.statusCode);
			res.setEncoding('utf8');

			res.on('data', function (chunk) {
				output += chunk;
				connection.sendUTF(input);
				console.log("Replied: "+input +" Data: "+data);
			});

			res.on('end', function() {
				var obj = JSON.parse(output);

				onResult(res.statusCode, obj);

			});
				});

		req.on('error', function(err) {
			//res.send('error: ' + err.message);
		});

		req.end();
		 */

		var Greet= ['Hi there. I am Deary, how can I help you?', 'Hi. I am Deary, how can I help you?', 'Hello. I am Deary, how can I help you', 'Hey. I am Deary, how can I help you']; 
		var Maintenance= ['Oh! Sorry for the inconvenience, maintenance engineer will be attending your issue soon', 'Issue has been logged, your problem will be fixed soon', 'Sad about it! will take care of this problem', 'I feel sorry for that, your issue will be attended soon'];
		var Emergency= ['I can help you with that', 'Calling 911..', 'I can reach out to your emergency contact', 'Take care, Contacting your doctor'];
		var Weather= ['It is cold/ hot/windy/rainy today', 'It is 54o, likely to rain tonight', 'Sunrise is at 5=30 AM today'];
		var Useless= ['I never really thought about it', 'hmm..', 'Ok, How can I help you with that', 'This is not for what I am here', 'I don’t think I can explain it', 'I wouldn’t worry about it'];
		var Bye= [ 'Bye', ' See you, It’s been a pleasure', 'Ok, see you later', 'You too. Bye', 'Bye bye!', 'Have a good one', 'All right then'];

		request1("http://ec2-34-207-241-247.compute-1.amazonaws.com:5000/classify?sentence="+input, function (error, response, body) {
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
			}else{
				input = 'I couldn\'t get that!';
			}
			connection.sendUTF(input);
			console.log("Replied: "+input);
		});




		/*i=0;
        	var interval=setInterval(func, 5000);
        	var score=[1,2,3,4,5,6];
        	function func(){
        		if(i==6){i=0;}
        		connection.sendUTF("Score: "+ score[i]+"<br> Comment: "+comments[i]);
        		console.log(score[i]);

        		i++;	
        		console.log("++"+score[i]);
        	}*/
		//out();
		/*setTimeout(function() {
        	connection.sendUTF('Location: '+ (i++));
        }, 1000);*/
	});
	connection.on('close', function(connection) {
		console.log('connection closed');
	});
}); 


/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
 */