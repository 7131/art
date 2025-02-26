// Color class
const Color = function(r, g, b) {
    this.r = Math.floor(r) % 256;
    this.g = Math.floor(g) % 256;
    this.b = Math.floor(b) % 256;
}

// parse hexadecimal string
Color.fromHex = function(text) {
    // check the arguments
    const match = /^#?([0-9a-fA-F]{6})$/.exec(text.trim());
    if (!match) {
        return new Color(0, 0, 0);
    }

    // get RGB value
    const r = parseInt(match[1].substring(0, 2), 16);
    const g = parseInt(match[1].substring(2, 4), 16);
    const b = parseInt(match[1].substring(4, 6), 16);
    return new Color(r, g, b);
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

// Point class
const Point = function(x, y) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
}

// parse coordinate string
Point.fromString = function(text) {
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

// Point prototype
Point.prototype = {

    // get coordinate string
    "toString": function() {
        return "(" + this.x + "," + this.y + ")";
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

        // coordinate calculation
        const points = [];
        for (let i = 1; i <= count; i++) {
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

        // coordinate calculation
        const points = [];
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

        // coordinate calculation
        const points = [];
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
        this._widthText = document.getElementById("width_value");
        this._heightText = document.getElementById("height_value");
        this._countText = document.getElementById("count_value");
        this._constantText = document.getElementById("constant_value");
        this._deltaText = document.getElementById("delta_value");
        this._colorInit = document.getElementById("color_init");
        this._colorStep = document.getElementById("color_step");
        this._widthSlider = document.getElementById("width");
        this._heightSlider = document.getElementById("height");
        this._countSlider = document.getElementById("count");
        this._constantSlider = document.getElementById("constant");
        this._deltaSlider = document.getElementById("delta");
        this._boardCanvas = document.getElementById("board");
        this._centerLabel = document.getElementById("center");
        this._methodRadios = Array.from(document.getElementsByName("method"));

        // common events
        this._patternText.addEventListener("change", this._drawCanvas.bind(this));
        this._widthText.addEventListener("change", this._changeWidthText.bind(this));
        this._heightText.addEventListener("change", this._changeHeightText.bind(this));
        this._countText.addEventListener("change", this._changeCountText.bind(this));
        this._constantText.addEventListener("change", this._changeConstantText.bind(this));
        this._deltaText.addEventListener("change", this._changeDeltaText.bind(this));
        this._colorInit.addEventListener("change", this._drawCanvas.bind(this));
        this._colorStep.addEventListener("change", this._drawCanvas.bind(this));
        this._widthSlider.addEventListener("input", this._changeWidthSlider.bind(this));
        this._heightSlider.addEventListener("input", this._changeHeightSlider.bind(this));
        this._countSlider.addEventListener("input", this._changeCountSlider.bind(this));
        this._constantSlider.addEventListener("input", this._changeConstantSlider.bind(this));
        this._deltaSlider.addEventListener("input", this._changeDeltaSlider.bind(this));
        this._methodRadios.forEach(elem => elem.addEventListener("change", this._drawCanvas.bind(this)));

        // drag events
        this._boardCanvas.addEventListener("mousedown", this._beginMouseDrag.bind(this));
        this._boardCanvas.addEventListener("mousemove", this._doMouseDrag.bind(this));
        this._boardCanvas.addEventListener("touchstart", this._beginTouchDrag.bind(this));
        this._boardCanvas.addEventListener("touchmove", this._doTouchDrag.bind(this));

        // initial drawing
        this._mouse = new Point(0, 0);
        this._center = new Point(0, 0);
        this._draw();
    },

    // "Draw" button process
    "_drawCanvas": function(e) {
        this._draw();
    },

    // canvas width text process
    "_changeWidthText": function(e) {
        this._setValue(this._widthText, this._widthSlider);
        this._changeArea();
    },

    // canvas height text process
    "_changeHeightText": function(e) {
        this._setValue(this._heightText, this._heightSlider);
        this._changeArea();
    },

    // "Number of segments" text process
    "_changeCountText": function(e) {
        this._setScale(this._countText, this._countSlider);
        this._draw();
    },

    // "Increase in length" text process
    "_changeConstantText": function(e) {
        this._setScale(this._constantText, this._constantSlider);
        this._draw();
    },

    // "Increase in angle" text process
    "_changeDeltaText": function(e) {
        this._setValue(this._deltaText, this._deltaSlider);
        this._draw();
    },

    // canvas width slider process
    "_changeWidthSlider": function(e) {
        this._widthText.value = this._widthSlider.value;
        this._changeArea();
    },

    // canvas height slider process
    "_changeHeightSlider": function(e) {
        this._heightText.value = this._heightSlider.value;
        this._changeArea();
    },

    // "Number of segments" slider process
    "_changeCountSlider": function(e) {
        this._countText.value = this._toScale(this._countSlider.value);
        this._draw();
    },

    // "Increase in length" slider process
    "_changeConstantSlider": function(e) {
        this._constantText.value = this._toScale(this._constantSlider.value);
        this._draw();
    },

    // "Increase in angle" slider process
    "_changeDeltaSlider": function(e) {
        this._deltaText.value = this._deltaSlider.value;
        this._draw();
    },

    // start dragging with mouse
    "_beginMouseDrag": function(e) {
        this._mouse.x = e.pageX;
        this._mouse.y = e.pageY;
        this._center = Point.fromString(this._centerLabel.textContent);
    },

    // drag processing with mouse
    "_doMouseDrag": function(e) {
        // whether left click
        if ((e.buttons & 0x0001) == 0) {
            return;
        }

        // coordinate calculation
        const dx = Math.round(e.pageX - this._mouse.x);
        const dy = Math.round(this._mouse.y - e.pageY);
        const center = new Point(this._center.x + dx, this._center.y + dy);

        // draw
        this._centerLabel.textContent = center.toString();
        this._draw();
    },

    // start dragging by touch
    "_beginTouchDrag": function(e) {
        // whether touched with two fingers
        if (e.touches.length != 2) {
            return;
        }

        // coordinate calculation
        this._mouse.x = e.touches[0].pageX;
        this._mouse.y = e.touches[0].pageY;
        this._center = Point.fromString(this._centerLabel.textContent);
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
        const dx = Math.round(e.touches[0].pageX - this._mouse.x);
        const dy = Math.round(this._mouse.y - e.touches[0].pageY);
        const center = new Point(this._center.x + dx, this._center.y + dy);

        // draw
        this._centerLabel.textContent = center.toString();
        this._draw();
    },

    // draw on the canvas
    "_draw": function() {
        // get settings
        const center = Point.fromString(this._centerLabel.textContent);
        const count = parseInt(this._countText.value, 10);
        const constant = parseFloat(this._constantText.value);
        const delta = parseInt(this._deltaText.value, 10);
        const color = Color.fromHex(this._colorInit.value);
        const step = Color.fromHex(this._colorStep.value);

        // formulas for drawing
        const radio = this._methodRadios.find(elem => elem.checked);
        const creator = new PointCreator(radio.value);

        // get the pattern
        const letters = this._patternText.value.toLowerCase().split("");
        const numbers = letters.map(elem => parseInt(elem, 36)).filter(elem => !isNaN(elem));
        const points = creator.create(numbers, count, constant, delta);

        // get drawing context
        const context = this._boardCanvas.getContext("2d");
        context.clearRect(0, 0, this._boardCanvas.width, this._boardCanvas.height);

        // draw line segments
        const cx = this._boardCanvas.width / 2 + center.x;
        const cy = this._boardCanvas.height / 2 - center.y;
        let x = cx;
        let y = cy;
        for (const pt of points) {
            context.beginPath();
            context.moveTo(x, y);
            context.strokeStyle = color.toHex();
            x = cx + pt.x;
            y = cy - pt.y;
            context.lineTo(x, y);
            context.stroke();
            color.addColor(step);
        }
    },

    // set the value to slider and text
    "_setValue": function(text, slider) {
        // get the value
        let value = parseInt(text.value, 10);
        if (isNaN(value)) {
            value = slider.min;
        }

        // reset the value
        slider.value = value;
        text.value = slider.value;
    },

    // set the scale to slider and text
    "_setScale": function(text, slider) {
        slider.value = this._fromScale(text.value, slider.min);
        text.value = this._toScale(slider.value);
    },

    // resize
    "_changeArea": function() {
        // get the settings
        const width = parseInt(this._widthText.value, 10);
        const height = parseInt(this._heightText.value, 10);

        // change the drawing size
        this._boardCanvas.width = width;
        this._boardCanvas.height = height;
        this._draw();
    },

    // convert integer to scale value
    "_toScale": function(input) {
        // get the integer value
        const value = parseInt(input, 10);
        if (isNaN(value)) {
            return "";
        }
        const scale = Math.floor(value / 9);
        const number = (value % 9) + 1;

        // convert to scale value (treated as a string due to error)
        if (scale < 0) {
            return "0." + "0".repeat(-scale - 1) + ((number + 8) % 9 + 1);
        } else {
            return number + "0".repeat(scale);
        }
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
        return scale * 9 + Math.floor(value) - 1;
    },

}

// start the controller
new Controller();

