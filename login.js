var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var engines = require('consolidate');
const cons = require('consolidate');


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});



app.get('/home', function(request, response) {
	
	if (request.session.loggedin) {
		var MarkerArray = [];
	 var gyms = connection.query('SELECT * FROM gyms');
	 connection.query('SELECT * FROM gyms', function(error, results, fields) {
		
		if (results.length > 0) {
			for(i=0;i<results.length;i++)
			{	
				var oneResult = 
				{location:{lat:results[i].GeoX,lng:results[i].GeoY},
				imageIcon: "https://img.icons8.com/nolan/2x/marker.png", 
				content: `<h2>`+results[i].Name+`</h2>`}
				MarkerArray.push(oneResult);
			}

			console.log(MarkerArray[0].content)
			 response.render('home',{points:JSON.stringify(MarkerArray)});
		} else {
			response.send('Something went wrong!');
		}			
		response.end();
	});

	} else {
		response.send('Please login to view this page!');
	}
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/register', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var email = request.body.email;
	if(request.body.gymOwner){
	var gywOwner = 'YES';}
	else
	{var gywOwner = 'NO';}

	if (username && password && email) {
		connection.query('INSERT INTO accounts (username, password, email, IsGymOwner) VALUES (?, ?, ?,?)', [username, password,email,gywOwner], function(error, results, fields) {
			response.send('You are registered!');
			response.end();
		});
	} else {
		response.send('Something Empty!');
		response.end();
	}
});



app.listen(3000);
