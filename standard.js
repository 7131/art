// Controller class
const Controller = function() {
    this._alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    window.addEventListener("load", this._initialize.bind(this));
}

// Controller prototype
Controller.prototype = {

    // initialize the private fields
    "_initialize": function(e) {
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
        widthRange.addEventListener("input", this._showValue.bind(this));
        widthRange.addEventListener("input", this._changeSize.bind(this));
        widthRange.addEventListener("input", this._draw.bind(this));
        heightRange.addEventListener("input", this._showValue.bind(this));
        heightRange.addEventListener("input", this._changeSize.bind(this));
        heightRange.addEventListener("input", this._draw.bind(this));
        countRange.addEventListener("input", this._showValue.bind(this));
        countRange.addEventListener("input", this._draw.bind(this));
        constantRange.addEventListener("input", this._showScale.bind(this));
        constantRange.addEventListener("input", this._draw.bind(this));
        deltaRange.addEventListener("input", this._showValue.bind(this));
        deltaRange.addEventListener("input", this._draw.bind(this));

        // events for IE
        widthRange.addEventListener("change", this._showValue.bind(this));
        widthRange.addEventListener("change", this._changeSize.bind(this));
        widthRange.addEventListener("change", this._draw.bind(this));
        heightRange.addEventListener("change", this._showValue.bind(this));
        heightRange.addEventListener("change", this._changeSize.bind(this));
        heightRange.addEventListener("change", this._draw.bind(this));
        countRange.addEventListener("change", this._showValue.bind(this));
        countRange.addEventListener("change", this._draw.bind(this));
        constantRange.addEventListener("change", this._showScale.bind(this));
        constantRange.addEventListener("change", this._draw.bind(this));
        deltaRange.addEventListener("change", this._showValue.bind(this));
        deltaRange.addEventListener("change", this._draw.bind(this));

        // common events
        drawButton.addEventListener("click", this._draw.bind(this));
    },

    // show the slider value
    "_showValue": function(e) {
        document.getElementById(e.srcElement.id + "_value").textContent = e.srcElement.value;
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
        if (e.srcElement.id == "height") {
            this._boardCanvas.height = e.srcElement.value;
        } else {
            this._boardCanvas.width = e.srcElement.value;
        }
    },

    // "Draw" button process
    "_draw": function(e) {
        // get settings
        const count = parseInt(this._countLabel.textContent, 10);
        const constant = parseFloat(this._constantLabel.textContent);
        const delta = parseInt(this._deltaLabel.textContent, 10);

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

