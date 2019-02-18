export class AppComponent {
  title = 'Monte Carlo Simulation to approximate pi';

  total;
  inside;
  stopped;
  i;
  // our variable to set interval, so the window won't freeze while looping through data
  intervalId
  // If they want to add only 1 dot
  singlePoint;



  constructor(){
    this.waitForLoad();
    this.i = 0;
    this.total = 0;
    this.inside = 0;
    this.stopped = false;
    this.singlePoint = false;
  }

  waitForLoad = () => {
     window.onload = function() {
      var c : any = document.getElementById("simCanvas");
      var ctx = c.getContext("2d");
      ctx.beginPath();
      ctx.arc(150, 150, 150, 0, 150);
      ctx.stroke();
    };
  }

  getPoints = () => {
      var Request = require("request");
      var baseUrl = "https://montecarloapi.herokuapp.com";
  	  Request.get(baseUrl, (error, response, body) => {
      		
          if(error) {
            return console.dir(error);
          }

          var data = JSON.parse(body);

          console.log(data);
          // Start simulation, this is if they only want to add 1 dot
          this.intervalFunction(data);

          // If they start simulation and don't want to just add 1 dot. 100 is the speed of animation.
          if (this.singlePoint == false){
            this.intervalId = setInterval(function() { this.intervalFunction(data); }.bind(this), 100);
          }
        });
  }


  // This is what will happen inside our setInterval
  intervalFunction = (data): any => {
    // Only is we are not at the end of data stream and if single point is either true or stopped is false
    if (this.i < data.length && (this.stopped == false || this.singlePoint)){
      // run our algo
      this.checkPoint(data[this.i]['x_point'], data[this.i]['y_point']);
      // Make sure to change our text values
      document.getElementById('total').innerHTML = String(this.total);
      document.getElementById('inside').innerHTML = String(this.inside);
      document.getElementById('pi').innerHTML = " = [4*(" + String(this.inside) + "/" + String(this.total) + ")] = " + String(this.inside / this.total * 4);
      this.i++;
      if (this.singlePoint) this.singlePoint = false;
    }else{
      // Reset state ready for next time.
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
  }

  // Clear interval and put stop variable to true
  stopSimulation = (): void => {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.stopped = true;
  }

  // Start the simulation
  startSimulation = (): void => {
    // Clear any previous intervals, we don't want them to start 5 sessions of intervals
    clearInterval(this.intervalId);
    this.intervalId = null;

    // Set stop and single point variables to false
    if (this.stopped){
      this.stopped = false;
    }
    if (this.singlePoint){
      this.singlePoint = false;
    }
    this.getPoints();
  }

  // Reset the simulation
  resetSimulation = (): void => {
    this.stopSimulation();
    
    // Clear our interval
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.total = 0;
    this.inside = 0;

    // Put all our text values to 0
    document.getElementById('total').innerHTML = String(this.total);
    document.getElementById('inside').innerHTML = String(this.inside);
    document.getElementById('pi').innerHTML = " = [4*(total dots inside circle / total dots)] = " + String(0);

    // Delete all the drawn dots
    var c : any = document.getElementById("simCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.arc(150, 150, 150, 0, 150);
    ctx.stroke();

    this.i = 0;
  }

  // Reset the simulation, and start it again
  resetAndStartSimulation = (): void => {
    this.resetSimulation();
    this.startSimulation();
  }

  // Stop our simulation and add a single dot
  addASinglePoint = (): void => {
    this.stopSimulation();
    this.singlePoint = true;
    this.getPoints();
    console.log("Added single point");
  }

  // Our main algo, given a float x and y, it will put a dot either inside or outside the circle
  // circle's radius is 150 so we check if point is inside or outside that
  checkPoint = (x, y): any => {

    // Check where this position is
    var num = (Math.sqrt(x ** 2 + y ** 2));

    // Check if it's inside the circle (so less than the radius of the circle which is 150)
    var insideCircle = num <= 1;
    console.log(num)
    console.log(insideCircle)

    this.total++;

    // Get canvas
    var c : any = document.getElementById("simCanvas");
    var ctx = c.getContext("2d");

    if (insideCircle){
      this.inside++;
    }
    

    var centerX = c.width * x;
    var centerY = c.height * y;

    ctx.fillRect(centerX, centerY, 1, 1);
  }

}
