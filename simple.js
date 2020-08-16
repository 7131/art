// Controller class
var Controller = function() {
    this._alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    window.addEventListener("load", this._initialize.bind(this), false);
}

// Controller prototype
Controller.prototype = {

    // initialize the private fields
    "_initialize": function() {
        // DOM elements
        this._patternText = document.getElementById("pattern");
        this._boardCanvas = document.getElementById("board");
        var drawButton = document.getElementById("draw");

        // button events
        drawButton.addEventListener("click", this._draw.bind(this), false);
    },

    // "Draw" button process
    "_draw": function() {
        // get the pattern
        var numbers = this._createNumbers(this._patternText.value);
        var points = this._createPoints(numbers);

        // get drawing context
        var context = this._boardCanvas.getContext("2d");
        context.clearRect(0, 0, this._boardCanvas.width, this._boardCanvas.height);
        context.beginPath();

        // draw line segments
        var cx = this._boardCanvas.width / 2;
        var cy = this._boardCanvas.height / 2;
        context.moveTo(cx + points[0].x, cy - points[0].y);
        for (var i = 1; i < points.length; i++) {
            context.lineTo(cx + points[i].x, cy - points[i].y);
        }
        context.stroke();
    },

    // create numbers
    "_createNumbers": function(pattern) {
        var numbers = [];

        // convert string to numeric array
        pattern = pattern.toLowerCase();
        for (var i = 0; i < pattern.length; i++) {
            var number = this._alphabet.indexOf(pattern[i]);
            if (0 <= number) {
                numbers.push(number);
            }
        }
        return numbers;
    },

    // create points
    "_createPoints": function(numbers) {
        var count = 200;
        var index = 0;
        var delta = Math.PI * 2 / 36;
        var radius = 0;
        var theta = 0;
        var points = [ new Point(0, 0) ];

        // polar coordinate transformation
        for (var i = 0; i < count; i++) {
            radius++;
            theta += numbers[index] * delta;
            var px = radius * Math.cos(theta);
            var py = radius * Math.sin(theta);
            points.push(new Point(px, py));
            index = (index + 1) % numbers.length;
        }
        return points;
    },

}

// Point class
var Point = function(x, y) {
    this.x = x;
    this.y = y;
}

// start the controller
new Controller();

