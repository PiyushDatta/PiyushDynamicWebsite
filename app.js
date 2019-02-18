console.log('Server-side code running');

// General node js starter configs
const express = require('express');
const app = express();
const path = require('path');

// Allows access to css files in public folder
// Keep at top to open up images and files in public much faster
app.use(express.static(path.join(__dirname, 'public')));

// localhost:5000
const PORT = process.env.PORT || 5000;

// Reading pdf
const fs = require('fs');

// Getting url's, we use mainly for our weather app
const request = require('request');

// body-parser allows us to make use of the key-value pairs stored on the req-body object, used to access city name
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Router for routing to pages, remember we set express() as app, so app.get is using router
const router = express.Router();

// Set the view engine to ejs
app.set('view engine', 'ejs');



// Logging 
const logger = require('morgan');
app.use(logger());


// Home Page
app.get('/', function(req, res){
	res.render("views_index");
})

// About/Resume Page
app.get('/About', function (req, res) {
    var filePath = "/public/PiyushDatta_CompSci_Resume.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

// Projects Page
app.get('/Projects', function(req, res){
	res.render("views_projects");
})

// Monte Carlo Pi Approximation Simulation
app.get('/MonteCarloSim', function(req, res){
  res.render("views_montecarlopi");
})

// Weather Application
app.get('/WeatherApp', function (req, res) {
  res.render('views_weatherapp', {weather: null, error: null});
})

app.post('/WeatherApp', function(req, res){

	// Api stuff
	let apiKey = 'c335ae80b2490afa5058383230aba268';
	let city = req.body.city;
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

	request(url, function (err, response, body) {
    	if(err){
      		res.render('views_weatherapp', {weather: null, error: 'Error, please try again'});
    	} else {
      		let weather = JSON.parse(body)
      		if(weather.main == undefined){
        		res.render('views_weatherapp', {weather: null, error: 'Error, please try again'});
      		} else {
        		let weatherText = `It's ${weather.main.temp}°C in ${weather.name}!`;
        		res.render('views_weatherapp', {weather: weatherText, error: 'Error, please try again'});
      		}
    	}
  	});
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
