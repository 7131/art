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
        this._countLabel = document.getElementById("count_value");
        this._constantLabel = document.getElementById("constant_value");
        this._deltaLabel = document.getElementById("delta_value");
        const drawButton = document.getElementById("draw");
        const widthRange = document.getElementById("width");
        const heightRange = document.getElementById("height");
        const countRange = document.getElementById("count");
        const constantRange = document.getElementById("constant");
        const deltaRange = document.getElementById("delta");

        // events for WebKit
        widthRange.addEventListener("input", this._showValue.bind(this), false);
        widthRange.addEventListener("input", this._changeSize.bind(this), false);
        widthRange.addEventListener("input", this._draw.bind(this), false);
        heightRange.addEventListener("input", this._showValue.bind(this), false);
        heightRange.addEventListener("input", this._changeSize.bind(this), false);
        heightRange.addEventListener("input", this._draw.bind(this), false);
        countRange.addEventListener("input", this._showValue.bind(this), false);
        countRange.addEventListener("input", this._draw.bind(this), false);
        constantRange.addEventListener("input", this._showScale.bind(this), false);
        constantRange.addEventListener("input", this._draw.bind(this), false);
        deltaRange.addEventListener("input", this._showValue.bind(this), false);
        deltaRange.addEventListener("input", this._draw.bind(this), false);

        // events for IE
        widthRange.addEventListener("change", this._showValue.bind(this), false);
        widthRange.addEventListener("change", this._changeSize.bind(this), false);
        widthRange.addEventListener("change", this._draw.bind(this), false);
        heightRange.addEventListener("change", this._showValue.bind(this), false);
        heightRange.addEventListener("change", this._changeSize.bind(this), false);
        heightRange.addEventListener("change", this._draw.bind(this), false);
        countRange.addEventListener("change", this._showValue.bind(this), false);
        countRange.addEventListener("change", this._draw.bind(this), false);
        constantRange.addEventListener("change", this._showScale.bind(this), false);
        constantRange.addEventListener("change", this._draw.bind(this), false);
        deltaRange.addEventListener("change", this._showValue.bind(this), false);
        deltaRange.addEventListener("change", this._draw.bind(this), false);

        // common events
        drawButton.addEventListener("click", this._draw.bind(this), false);
    },

    // show the slider value
    "_showValue": function(e) {
        // get the slider value
        let value = e.srcElement.value;
        if (e.srcElement.id == "height") {
            // vertical slider
            value = -value;
        }

        // display in corresponding textbox
        document.getElementById(e.srcElement.id + "_value").textContent = value;
    },

    // show the scale value
    "_showScale": function(e) {
        // get the slider value
        const value = e.srcElement.value;
        let scale = Math.floor(value / 9);
        let number = (value % 9) + 1;

        // convert to scale value (treated as a string due to error)
        let text;
        if (value < 0) {
            // less than 1
            scale++;
            number += 9;
            if (number == 10) {
                number = 1;
            }
            text = "" + number;
            while (scale < 0) {
                text = "0" + text;
                scale++;
            }
            text = "0." + text;
        } else {
            // 1 or more
            text = "" + number;
            while (0 < scale) {
                text += "0";
                scale--;
            }
        }

        // set the value
        document.getElementById(e.srcElement.id + "_value").textContent = text;
    },

    // change the canvas size
    "_changeSize": function(e) {
        const value = e.srcElement.value;
        if (e.srcElement.id == "height") {
            this._boardCanvas.height = -value;
        } else {
            this._boardCanvas.width = value;
        }
    },

    // "Draw" button process
    "_draw": function() {
        // get settings
        const count = parseInt(this._countLabel.textContent);
        const constant = parseFloat(this._constantLabel.textContent);
        const delta = parseInt(this._deltaLabel.textContent);

        // get the pattern
        const pattern = this._patternText.value;
        const numbers = this._createNumbers(pattern);
        const points = this._createPoints(numbers, count, constant, delta);

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
    "_createPoints": function(numbers, count, constant, angle) {
        const delta = Math.PI * 2 * angle / 360;
        let index = 0;
        let radius = 0;
        let theta = 0;

        // polar coordinate transformation
        const points = [ new Point(0, 0) ];
        for (let i = 0; i < count; i++) {
            radius += constant;
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

