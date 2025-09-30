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
        this._widthLabel = document.getElementById("width_value");
        this._heightLabel = document.getElementById("height_value");
        this._countLabel = document.getElementById("count_value");
        this._constantLabel = document.getElementById("constant_value");
        this._deltaLabel = document.getElementById("delta_value");
        this._widthSlider = document.getElementById("width");
        this._heightSlider = document.getElementById("height");
        this._countSlider = document.getElementById("count");
        this._constantSlider = document.getElementById("constant");
        this._deltaSlider = document.getElementById("delta");
        this._boardCanvas = document.getElementById("board");
        const drawButton = document.getElementById("draw");

        // events
        this._widthSlider.addEventListener("input", this._changeWidthSlider.bind(this));
        this._heightSlider.addEventListener("input", this._changeHeightSlider.bind(this));
        this._countSlider.addEventListener("input", this._changeCountSlider.bind(this));
        this._constantSlider.addEventListener("input", this._changeConstantSlider.bind(this));
        this._deltaSlider.addEventListener("input", this._changeDeltaSlider.bind(this));
        drawButton.addEventListener("click", this._drawCanvas.bind(this));
    },

    // canvas width slider process
    "_changeWidthSlider": function(e) {
        const width = this._widthSlider.value;
        this._widthLabel.textContent = width;
        this._boardCanvas.width = width;
        this._draw();
    },

    // canvas height slider process
    "_changeHeightSlider": function(e) {
        const height = this._heightSlider.value;
        this._heightLabel.textContent = height;
        this._boardCanvas.height = height;
        this._draw();
    },

    // "Number of segments" slider process
    "_changeCountSlider": function(e) {
        this._countLabel.textContent = this._countSlider.value;
        this._draw();
    },

    // "Increase in length" slider process
    "_changeConstantSlider": function(e) {
        // get the slider value
        const value = parseInt(this._constantSlider.value, 10);
        const scale = Math.floor(value / 9);
        const number = (value % 9) + 1;

        // convert to scale value (treated as a string due to error)
        let text;
        if (scale < 0) {
            text = `0.${"0".repeat(-scale - 1)}${(number + 8) % 9 + 1}`;
        } else {
            text = `${number}${"0".repeat(scale)}`;
        }

        // set the value
        this._constantLabel.textContent = text;
        this._draw();
    },

    // "Increase in angle" slider process
    "_changeDeltaSlider": function(e) {
        this._deltaLabel.textContent = this._deltaSlider.value;
        this._draw();
    },

    // "Draw" button process
    "_drawCanvas": function(e) {
        this._draw();
    },

    // draw on the canvas
    "_draw": function() {
        // get settings
        const count = parseInt(this._countLabel.textContent, 10);
        const constant = parseFloat(this._constantLabel.textContent);
        const delta = parseInt(this._deltaLabel.textContent, 10);

        // get the pattern
        const letters = this._patternText.value.toLowerCase().split("");
        const numbers = letters.map(elem => parseInt(elem, 36)).filter(elem => !isNaN(elem));
        const points = this._createPoints(numbers, count, constant, delta);

        // get drawing context
        const context = this._boardCanvas.getContext("2d");
        context.clearRect(0, 0, this._boardCanvas.width, this._boardCanvas.height);
        context.beginPath();

        // draw line segments
        const cx = this._boardCanvas.width / 2;
        const cy = this._boardCanvas.height / 2;
        context.moveTo(cx, cy);
        points.forEach(elem => context.lineTo(cx + elem.x, cy - elem.y));
        context.stroke();
    },

    // create points
    "_createPoints": function(numbers, count, constant, angle) {
        const delta = Math.PI * 2 * angle / 360;
        let index = 0;
        let radius = 0;
        let theta = 0;

        // polar coordinate transformation
        const points = [];
        for (let i = 0; i < count; i++) {
            radius += constant;
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

