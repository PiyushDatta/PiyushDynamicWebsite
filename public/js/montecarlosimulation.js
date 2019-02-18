"use strict";
exports.__esModule = true;
var AppComponent = /** @class */ (function() {
    function AppComponent() {
        var _this = this;
        this.title = 'Monte Carlo Simulation to approximate pi';
        this.waitForLoad = function() {
            window.onload = function() {
                var c = document.getElementById("simCanvas");
                var ctx = c.getContext("2d");
                ctx.beginPath();
                ctx.arc(150, 150, 150, 0, 150);
                ctx.stroke();
            };
        };
        this.getPoints = function() {
            var baseUrl = 'https://montecarloapi.herokuapp.com/apipoints/';
            fetch(baseUrl)
                .then(response => response.json())
                .then(data => { 
                    // Start simulation, this is if they only want to add 1 dot
                    _this.intervalFunction(data);
                    // If they start simulation and don't want to just add 1 dot. 100 is the speed of animation.
                    if (_this.singlePoint == false) {
                        _this.intervalId = setInterval(function() { this.intervalFunction(data); }.bind(_this), 100);
                    }
                })
                .catch(err => {
                    console.error('An error ocurred', err);
                });
        }


        // This is what will happen inside our setInterval
        this.intervalFunction = function(data) {
            // Only is we are not at the end of data stream and if single point is either true or stopped is false
            if (_this.i < data.length && (_this.stopped == false || _this.singlePoint)) {
                // run our algo
                _this.checkPoint(data[_this.i]['x_point'], data[_this.i]['y_point']);
                // Make sure to change our text values
                document.getElementById('total').innerHTML = String(_this.total);
                document.getElementById('inside').innerHTML = String(_this.inside);
                document.getElementById('pi').innerHTML = " = [4*(" + String(_this.inside) + "/" + String(_this.total) + ")] = " + String(_this.inside / _this.total * 4);
                _this.i++;
                if (_this.singlePoint)
                    _this.singlePoint = false;
            } else {
                // Reset state ready for next time.
                clearInterval(_this.intervalId);
                _this.intervalId = null;
            }
        };
        // Clear interval and put stop variable to true
        this.stopSimulation = function() {
            clearInterval(_this.intervalId);
            _this.intervalId = null;
            _this.stopped = true;
        };
        // Start the simulation
        this.startSimulation = function() {
            // Clear any previous intervals, we don't want them to start 5 sessions of intervals
            clearInterval(_this.intervalId);
            _this.intervalId = null;
            // Set stop and single point variables to false
            if (_this.stopped) {
                _this.stopped = false;
            }
            if (_this.singlePoint) {
                _this.singlePoint = false;
            }
            _this.getPoints();
        };
        // Reset the simulation
        this.resetSimulation = function() {
            _this.stopSimulation();
            // Clear our interval
            clearInterval(_this.intervalId);
            _this.intervalId = null;
            _this.total = 0;
            _this.inside = 0;
            // Put all our text values to 0
            document.getElementById('total').innerHTML = String(_this.total);
            document.getElementById('inside').innerHTML = String(_this.inside);
            document.getElementById('pi').innerHTML = " = [4*(total dots inside circle / total dots)] = " + String(0);
            // Delete all the drawn dots
            var c = document.getElementById("simCanvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.beginPath();
            ctx.arc(150, 150, 150, 0, 150);
            ctx.stroke();
            _this.i = 0;
        };
        // Reset the simulation, and start it again
        this.resetAndStartSimulation = function() {
            _this.resetSimulation();
            _this.startSimulation();
        };
        // Stop our simulation and add a single dot
        this.addASinglePoint = function() {
            _this.stopSimulation();
            _this.singlePoint = true;
            _this.getPoints();
            console.log("Added single point");
        };
        // Our main algo, given a float x and y, it will put a dot either inside or outside the circle
        // circle's radius is 150 so we check if point is inside or outside that
        this.checkPoint = function(x, y) {
            // Check where this position is
            var num = (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
            // Check if it's inside the circle (so less than the radius of the circle which is 150)
            var insideCircle = num <= 1;
            console.log(num);
            console.log(insideCircle);
            _this.total++;
            // Get canvas
            var c = document.getElementById("simCanvas");
            var ctx = c.getContext("2d");
            if (insideCircle) {
                _this.inside++;
            }
            var centerX = c.width * x;
            var centerY = c.height * y;
            ctx.fillRect(centerX, centerY, 1, 1);
        };
        this.waitForLoad();
        this.i = 0;
        this.total = 0;
        this.inside = 0;
        this.stopped = false;
        this.singlePoint = false;
    }
    return AppComponent;
}());
exports.AppComponent = AppComponent;
var classInstance = new AppComponent();