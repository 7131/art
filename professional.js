// Controller class
const Controller = function() {
    // fields
    this._alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    this._mouse = new Point(0, 0);
    this._center = new Point(0, 0);

    // events
    window.addEventListener("load", this._initialize.bind(this));
}

// Controller prototype
Controller.prototype = {

    // initialize the private fields
    "_initialize": function(e) {
        // DOM elements
        this._patternText = document.getElementById("pattern");
        this._widthText = document.getElementById("width_value");
        this._heightText = document.getElementById("height_value");
        this._boardCanvas = document.getElementById("board");
        this._centerLabel = document.getElementById("center");
        this._countText = document.getElementById("count_value");
        this._constantText = document.getElementById("constant_value");
        this._deltaText = document.getElementById("delta_value");
        this._colorInit = document.getElementById("color_init");
        this._colorStep = document.getElementById("color_step");
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
        countRange.addEventListener("input", this._showScale.bind(this));
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
        countRange.addEventListener("change", this._showScale.bind(this));
        countRange.addEventListener("change", this._draw.bind(this));
        constantRange.addEventListener("change", this._showScale.bind(this));
        constantRange.addEventListener("change", this._draw.bind(this));
        deltaRange.addEventListener("change", this._showValue.bind(this));
        deltaRange.addEventListener("change", this._draw.bind(this));

        // common events
        this._widthText.addEventListener("change", this._setValueSlider.bind(this));
        this._widthText.addEventListener("change", this._changeSize.bind(this));
        this._widthText.addEventListener("change", this._draw.bind(this));
        this._heightText.addEventListener("change", this._setValueSlider.bind(this));
        this._heightText.addEventListener("change", this._changeSize.bind(this));
        this._heightText.addEventListener("change", this._draw.bind(this));
        this._countText.addEventListener("change", this._setScaleSlider.bind(this));
        this._countText.addEventListener("change", this._draw.bind(this));
        this._constantText.addEventListener("change", this._setScaleSlider.bind(this));
        this._constantText.addEventListener("change", this._draw.bind(this));
        this._deltaText.addEventListener("change", this._setValueSlider.bind(this));
        this._deltaText.addEventListener("change", this._draw.bind(this));
        this._patternText.addEventListener("change", this._draw.bind(this));
        this._colorInit.addEventListener("change", this._draw.bind(this));
        this._colorStep.addEventListener("change", this._draw.bind(this));

        // drag events
        this._boardCanvas.addEventListener("mousedown", this._beginMouseDrag.bind(this));
        this._boardCanvas.addEventListener("mouseover", this._beginMouseDrag.bind(this));
        this._boardCanvas.addEventListener("mouseenter", this._beginMouseDrag.bind(this));
        this._boardCanvas.addEventListener("mousemove", this._doMouseDrag.bind(this));
        this._boardCanvas.addEventListener("touchstart", this._beginTouchDrag.bind(this));
        this._boardCanvas.addEventListener("touchmove", this._doTouchDrag.bind(this));

        // radio button
        for (const radio of document.getElementsByName("method")) {
            radio.addEventListener("change", this._draw.bind(this));
        }

        // initial drawing
        this._draw(e);
    },

    // show the slider value
    "_showValue": function(e) {
        document.getElementById(e.srcElement.id + "_value").value = e.srcElement.value;
    },

    // show the scale value
    "_showScale": function(e) {
        const scale = this._toScale(e.srcElement.value);
        document.getElementById(e.srcElement.id + "_value").value = scale;
    },

    // convert integer to scale value
    "_toScale": function(input) {
        // get the integer value
        const value = parseInt(input, 10);
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
        return text;
    },

    // convert from scale value to integer
    "_fromScale": function(input, min) {
        // get the scale value
        let value = parseFloat(input);
        if (isNaN(value) || value <= 0) {
            // less than or equal to 0
            return min;
        }
        let scale = 0;
        if (value < 1) {
            // less than 1
            while (value < 1) {
                scale--;
                value *= 10;
            }
        } else {
            // 1 or more
            while (10 <= value) {
                scale++;
                value /= 10;
            }
        }
        const number = Math.floor(value);
        return scale * 9 + number - 1;
    },

    // set the value to the slider
    "_setValueSlider": function(e) {
        // get the slider
        const id = e.srcElement.id.replace(/_value$/, "");
        const slider = document.getElementById(id);

        // get the value
        let value = parseInt(e.srcElement.value, 10);
        if (isNaN(value)) {
            value = slider.min;
        }

        // reset the value
        slider.value = value;
        e.srcElement.value = slider.value;
    },

    // convert value to scale and set on slider
    "_setScaleSlider": function(e) {
        // get the slider
        const id = e.srcElement.id.replace(/_value$/, "");
        const slider = document.getElementById(id);

        // set to the slider
        slider.value = this._fromScale(e.srcElement.value, slider.min);

        // reset the value
        e.srcElement.value = this._toScale(slider.value);
    },

    // resize
    "_changeSize": function(e) {
        // get the settings
        const width = parseInt(this._widthText.value, 10);
        const height = parseInt(this._heightText.value, 10);

        // change the drawing size
        this._boardCanvas.width = width;
        this._boardCanvas.height = height;
    },

    // start dragging with mouse
    "_beginMouseDrag": function(e) {
        this._mouse.x = Math.round(e.pageX);
        this._mouse.y = Math.round(e.pageY);
        this._center = this._createPoint(this._centerLabel.textContent);
    },

    // start dragging by touch
    "_beginTouchDrag": function(e) {
        // whether touched with two fingers
        if (e.touches.length != 2) {
            return;
        }

        // coordinate calculation
        this._mouse.x = Math.round(e.touches[0].pageX);
        this._mouse.y = Math.round(e.touches[0].pageY);
        this._center = this._createPoint(this._centerLabel.textContent);
    },

    // drag processing with mouse
    "_doMouseDrag": function(e) {
        // whether left click
        if ((e.buttons & 0x0001) == 0) {
            return;
        }

        // coordinate calculation
        const current = new Point(0, 0);
        current.x = Math.round(e.pageX);
        current.y = Math.round(e.pageY);

        // draw
        const diff = new Point(current.x - this._mouse.x, this._mouse.y - current.y);
        diff.addPoint(this._center);
        this._centerLabel.textContent = diff.toString();
        this._draw(e);
    },

    // drag processing by touch
    "_doTouchDrag": function(e) {
        // whether touched with two fingers
        if (e.targetTouches.length != 2) {
            return;
        }
        const first = e.targetTouches[0];
        const second = e.targetTouches[1];
        if (first.offsetX < 0 || this._boardCanvas.width < first.offsetX || first.offsetY < 0 || this._boardCanvas.height < first.offsetY) {
            return;
        }
        if (second.offsetX < 0 || this._boardCanvas.width < second.offsetX || second.offsetY < 0 || this._boardCanvas.height < second.offsetY) {
            return;
        }
        e.preventDefault();

        // coordinate calculation
        const current = new Point(0, 0);
        current.x = Math.round(e.touches[0].pageX);
        current.y = Math.round(e.touches[0].pageY);

        // draw
        const diff = new Point(current.x - this._mouse.x, this._mouse.y - current.y);
        diff.addPoint(this._center);
        this._centerLabel.textContent = diff.toString();
        this._draw(e);
    },

    // draw
    "_draw": function(e) {
        // get the settings
        const count = parseInt(this._countText.value, 10);
        const center = this._createPoint(this._centerLabel.textContent);
        const constant = parseFloat(this._constantText.value);
        const delta = parseInt(this._deltaText.value, 10);
        const color = this._createColor("#" + this._colorInit.value);
        const step = this._createColor("#" + this._colorStep.value);

        // formulas for drawing
        let method = "";
        for (const radio of document.getElementsByName("method")) {
            if (radio.checked) {
                method = radio.value;
            }
        }
        const creator = new PointCreator(method);

        // get the pattern
        const pattern = this._patternText.value;
        const numbers = this._createNumbers(pattern);
        const points = creator.create(numbers, count, constant, delta);

        // get drawing context
        const context = this._boardCanvas.getContext("2d");
        context.clearRect(0, 0, this._boardCanvas.width, this._boardCanvas.height);

        // draw line segments
        center.x = this._boardCanvas.width / 2 + center.x;
        center.y = this._boardCanvas.height / 2 - center.y;
        let x = center.x + points[0].x;
        let y = center.y - points[0].y;
        for (let i = 1; i < points.length; i++) {
            context.beginPath();
            context.moveTo(x, y);
            context.strokeStyle = color.toHex();
            x = center.x + points[i].x;
            y = center.y - points[i].y;
            context.lineTo(x, y);
            context.stroke();
            color.addColor(step);
        }
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

    // create point class from coordinate string
    "_createPoint": function(text) {
        // check the arguments
        const match = /^\((-?\d+),(-?\d+)\)$/.exec(text);
        if (!match) {
            return new Point(0, 0);
        }

        // coordinate calculation
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        return new Point(x, y);
    },

    // create color class from hexadecimal string
    "_createColor": function(text) {
        // check the arguments
        const lower = text.trim().toLowerCase();
        if (!/^#[0-9a-f]{6}$/.test(lower)) {
            return new Color(0, 0, 0);
        }

        // get RGB value
        const r = parseInt(lower.substring(1, 3), 16);
        const g = parseInt(lower.substring(3, 5), 16);
        const b = parseInt(lower.substring(5, 7), 16);
        return new Color(r, g, b);
    },

}

// Point creator class
const PointCreator = function(method) {
    switch (method) {
        case "spectral":
            this.create = this._createSpectral;
            break;
        case "screw":
            this.create = this._createScrew;
            break;
        default:
            this.create = this._createSpiral;
            break;
    }
}

// Point creator prototype
PointCreator.prototype = {

    // create spectral coordinates
    "_createSpectral": function(numbers, count, constant, angle) {
        const delta = angle;
        let index = 0;

        // polar coordinate transformation
        const points = [];
        for (let i = 0; i < count; i++) {
            const px = i * constant;
            const py = numbers[index] * delta;
            points.push(new Point(px, py));
            index = (index + 1) % numbers.length;
        }
        return points;
    },

    // create screw projective coordinates
    "_createScrew": function(numbers, count, constant, angle) {
        const delta = Math.PI * 2 * angle / 360;
        let index = 0;
        let px = 0;
        let py = 0;

        // polar coordinate transformation
        const points = [ new Point(px, py) ];
        for (let i = 0; i < count; i++) {
            const radius = constant;
            const theta = numbers[index] * delta;
            px += radius * Math.cos(theta);
            py += radius * Math.sin(theta);
            points.push(new Point(px, py));
            index = (index + 1) % numbers.length;
        }
        return points;
    },

    // create spiral coordinates
    "_createSpiral": function(numbers, count, constant, angle) {
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

// Point prototype
Point.prototype = {

    // add a point
    "addPoint": function(other) {
        this.x += other.x;
        this.y += other.y;
    },

    // get coordinate string
    "toString": function() {
        return "(" + this.x + "," + this.y + ")";
    },

}

// Color class
const Color = function(r, g, b) {
    this.r = r % 256;
    this.g = g % 256;
    this.b = b % 256;
}

// Color prototype
Color.prototype = {

    // add color circulation
    "addColor": function(color) {
        this.r = (this.r + color.r) % 256;
        this.g = (this.g + color.g) % 256;
        this.b = (this.b + color.b) % 256;
    },

    // get hexadecimal string
    "toHex": function() {
        const r = ("0" + this.r.toString(16)).slice(-2);
        const g = ("0" + this.g.toString(16)).slice(-2);
        const b = ("0" + this.b.toString(16)).slice(-2);
        return "#" + r + g + b;
    },

}

// start the controller
new Controller();

