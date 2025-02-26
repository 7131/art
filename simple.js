// Controller class
const Controller = function() {
    window.addEventListener("load", this._initialize.bind(this));
}

// Controller prototype
Controller.prototype = {

    // initialize the private fields
    "_initialize": function(e) {
        // DOM elements
        this._patternText = document.getElementById("pattern");
        this._boardCanvas = document.getElementById("board");
        const drawButton = document.getElementById("draw");

        // events
        drawButton.addEventListener("click", this._draw.bind(this));
    },

    // "Draw" button process
    "_draw": function(e) {
        // get the pattern
        const letters = this._patternText.value.toLowerCase().split("");
        const numbers = letters.map(elem => parseInt(elem, 36)).filter(elem => !isNaN(elem));
        const points = this._createPoints(numbers);

        // get drawing context
        const context = this._boardCanvas.getContext("2d");
        context.clearRect(0, 0, this._boardCanvas.width, this._boardCanvas.height);
        context.beginPath();

        // draw line segments
        const cx = this._boardCanvas.width / 2;
        const cy = this._boardCanvas.height / 2;
        context.moveTo(cx, cy);
        for (const pt of points) {
            context.lineTo(cx + pt.x, cy - pt.y);
        }
        context.stroke();
    },

    // create points
    "_createPoints": function(numbers) {
        const count = 200;
        const delta = Math.PI * 2 / 36;
        let index = 0;
        let radius = 0;
        let theta = 0;

        // polar coordinate transformation
        const points = [];
        for (let i = 0; i < count; i++) {
            radius++;
            theta += numbers[index] * delta;
            const px = radius * Math.cos(theta);
            const py = radius * Math.sin(theta);
            points.push({ "x": px, "y": py });
            index = (index + 1) % numbers.length;
        }
        return points;
    },

}

// start the controller
new Controller();

