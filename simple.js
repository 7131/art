// Controller class
const Controller = function() {
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
        const drawButton = document.getElementById("draw");

        // button events
        drawButton.addEventListener("click", this._draw.bind(this), false);
    },

    // "Draw" button process
    "_draw": function() {
        // get the pattern
        const numbers = this._createNumbers(this._patternText.value);
        const points = this._createPoints(numbers);

        // get drawing context
        const context = this._boardCanvas.getContext("2d");
        context.clearRect(0, 0, this._boardCanvas.width, this._boardCanvas.height);
        context.beginPath();

        // draw line segments
        const cx = this._boardCanvas.width / 2;
        const cy = this._boardCanvas.height / 2;
        context.moveTo(cx + points[0].x, cy - points[0].y);
        for (let i = 1; i < points.length; i++) {
            context.lineTo(cx + points[i].x, cy - points[i].y);
        }
        context.stroke();
    },

    // create numbers
    "_createNumbers": function(pattern) {
        const numbers = [];

        // convert string to numeric array
        for (const letter of pattern.toLowerCase()) {
            const number = this._alphabet.indexOf(letter);
            if (0 <= number) {
                numbers.push(number);
            }
        }
        return numbers;
    },

    // create points
    "_createPoints": function(numbers) {
        const count = 200;
        const delta = Math.PI * 2 / 36;
        let index = 0;
        let radius = 0;
        let theta = 0;

        // polar coordinate transformation
        const points = [ new Point(0, 0) ];
        for (let i = 0; i < count; i++) {
            radius++;
            theta += numbers[index] * delta;
            const px = radius * Math.cos(theta);
            const py = radius * Math.sin(theta);
            points.push(new Point(px, py));
            index = (index + 1) % numbers.length;
        }
        return points;
    },

}

// Point class
const Point = function(x, y) {
    this.x = x;
    this.y = y;
}

// start the controller
new Controller();

