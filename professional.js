// Controller class
var Controller = function() {
    // fields
    this._alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    this._mouse = new Point(0, 0);
    this._center = new Point(0, 0);

    // events
    window.addEventListener("load", this._initialize.bind(this), false);
}

// Controller prototype
Controller.prototype = {

    // initialize the private fields
    "_initialize": function() {
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
        var widthRange = document.getElementById("width");
        var heightRange = document.getElementById("height");
        var countRange = document.getElementById("count");
        var constantRange = document.getElementById("constant");
        var deltaRange = document.getElementById("delta");

        // events for WebKit
        widthRange.addEventListener("input", this._showValue.bind(this), false);
        widthRange.addEventListener("input", this._changeSize.bind(this), false);
        widthRange.addEventListener("input", this._draw.bind(this), false);
        heightRange.addEventListener("input", this._showValue.bind(this), false);
        heightRange.addEventListener("input", this._changeSize.bind(this), false);
        heightRange.addEventListener("input", this._draw.bind(this), false);
        countRange.addEventListener("input", this._showScale.bind(this), false);
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
        countRange.addEventListener("change", this._showScale.bind(this), false);
        countRange.addEventListener("change", this._draw.bind(this), false);
        constantRange.addEventListener("change", this._showScale.bind(this), false);
        constantRange.addEventListener("change", this._draw.bind(this), false);
        deltaRange.addEventListener("change", this._showValue.bind(this), false);
        deltaRange.addEventListener("change", this._draw.bind(this), false);

        // common events
        this._widthText.addEventListener("change", this._setValueSlider.bind(this), false);
        this._widthText.addEventListener("change", this._changeSize.bind(this), false);
        this._widthText.addEventListener("change", this._draw.bind(this), false);
        this._heightText.addEventListener("change", this._setValueSlider.bind(this), false);
        this._heightText.addEventListener("change", this._changeSize.bind(this), false);
        this._heightText.addEventListener("change", this._draw.bind(this), false);
        this._countText.addEventListener("change", this._setScaleSlider.bind(this), false);
        this._countText.addEventListener("change", this._draw.bind(this), false);
        this._constantText.addEventListener("change", this._setScaleSlider.bind(this), false);
        this._constantText.addEventListener("change", this._draw.bind(this), false);
        this._deltaText.addEventListener("change", this._setValueSlider.bind(this), false);
        this._deltaText.addEventListener("change", this._draw.bind(this), false);
        this._patternText.addEventListener("change", this._draw.bind(this), false);
        this._colorInit.addEventListener("change", this._draw.bind(this), false);
        this._colorStep.addEventListener("change", this._draw.bind(this), false);

        // drag events
        this._boardCanvas.addEventListener("mousedown", this._beginMouseDrag.bind(this), false);
        this._boardCanvas.addEventListener("mouseover", this._beginMouseDrag.bind(this), false);
        this._boardCanvas.addEventListener("mouseenter", this._beginMouseDrag.bind(this), false);
        this._boardCanvas.addEventListener("mousemove", this._doMouseDrag.bind(this), false);
        this._boardCanvas.addEventListener("touchstart", this._beginTouchDrag.bind(this), false);
        this._boardCanvas.addEventListener("touchmove", this._doTouchDrag.bind(this), false);

        // radio button
        var methods = document.getElementsByName("method");
        for (var i = 0; i < methods.length; i++) {
            methods[i].addEventListener("change", this._draw.bind(this), false);
        }

        // initial drawing
        this._draw();
    },

    // show the slider value
    "_showValue": function(e) {
        // get the slider value
        var value = e.srcElement.value;
        if (e.srcElement.id == "height") {
            // vertical slider
            value = -value;
        }

        // display in corresponding textbox
        document.getElementById(e.srcElement.id + "_value").value = value;
    },

    // show the scale value
    "_showScale": function(e) {
        var scale = this._toScale(e.srcElement.value);
        document.getElementById(e.srcElement.id + "_value").value = scale;
    },

    // convert integer to scale value
    "_toScale": function(input) {
        // get the integer value
        var value = parseInt(input);
        var scale = Math.floor(value / 9);
        var number = (value % 9) + 1;

        // convert to scale value (treated as a string due to error)
        var text;
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
    "_fromScale": function(input) {
        // get the scale value
        var text = "" + parseFloat(input);
        var scale = 0;
        if (/^0\./.test(text)) {
            // less than 1
            scale--;
            text = text.slice(2);
            while (/^0/.test(text)) {
                scale--;
                text = text.slice(1);
            }
        } else {
            // 1 or more
            while (/0$/.test(text)) {
                scale++;
                text = text.slice(0, -1);
            }
        }
        var number = parseInt(text.slice(0, 1));
        return scale * 9 + number - 1;
    },

    // set the value to the slider
    "_setValueSlider": function(e) {
        // get the slider
        var id = e.srcElement.id.replace(/_value$/, "");
        var slider = document.getElementById(id);

        // get the value
        var value = parseInt(e.srcElement.value);

        // set to the slider
        if (id == "height") {
            // vertical slider
            slider.value = -value;
            value = -slider.value;
        } else {
            // other slider
            slider.value = value;
            value = slider.value;
        }

        // reset the value
        e.srcElement.value = value;
    },

    // convert value to scale and set on slider
    "_setScaleSlider": function(e) {
        // get the slider
        var id = e.srcElement.id.replace(/_value$/, "");
        var slider = document.getElementById(id);

        // set to the slider
        slider.value = this._fromScale(e.srcElement.value);

        // reset the value
        e.srcElement.value = this._toScale(slider.value);
    },

    // resize
    "_changeSize": function() {
        // get the settings
        var width = parseInt(this._widthText.value);
        var height = parseInt(this._heightText.value);

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
        var current = new Point(0, 0);
        current.x = Math.round(e.pageX);
        current.y = Math.round(e.pageY);

        // draw
        var diff = new Point(current.x - this._mouse.x, this._mouse.y - current.y);
        diff.addPoint(this._center);
        this._centerLabel.textContent = diff.toString();
        this._draw();
    },

    // drag processing by touch
    "_doTouchDrag": function(e) {
        // whether touched with two fingers
        if (e.targetTouches.length != 2) {
            return;
        }
        var first = e.targetTouches[0];
        var second = e.targetTouches[1];
        if (first.offsetX < 0 || this._boardCanvas.width < first.offsetX || first.offsetY < 0 || this._boardCanvas.height < first.offsetY) {
            return;
        }
        if (second.offsetX < 0 || this._boardCanvas.width < second.offsetX || second.offsetY < 0 || this._boardCanvas.height < second.offsetY) {
            return;
        }
        e.preventDefault();

        // coordinate calculation
        var current = new Point(0, 0);
        current.x = Math.round(e.touches[0].pageX);
        current.y = Math.round(e.touches[0].pageY);

        // draw
        var diff = new Point(current.x - this._mouse.x, this._mouse.y - current.y);
        diff.addPoint(this._center);
        this._centerLabel.textContent = diff.toString();
        this._draw();
    },

    // draw
    "_draw": function() {
        // get the settings
        var count = parseInt(this._countText.value);
        var center = this._createPoint(this._centerLabel.textContent);
        var constant = parseFloat(this._constantText.value);
        var delta = parseInt(this._deltaText.value);
        var color = this._createColor("#" + this._colorInit.value);
        var step = this._createColor("#" + this._colorStep.value);

        // formulas for drawing
        var radios = document.getElementsByName("method");
        var method = "";
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                method = radios[i].value;
            }
        }
        var creator = new PointCreator(method);

        // get the pattern
        var pattern = this._patternText.value;
        var numbers = this._createNumbers(pattern);
        var points = creator.create(numbers, count, constant, delta);

        // get drawing context
        var context = this._boardCanvas.getContext("2d");
        context.clearRect(0, 0, this._boardCanvas.width, this._boardCanvas.height);

        // draw line segments
        center.x = this._boardCanvas.width / 2 + center.x;
        center.y = this._boardCanvas.height / 2 - center.y;
        var x = center.x + points[0].x;
        var y = center.y - points[0].y;
        for (var i = 1; i < points.length; i++) {
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

    // create point class from coordinate string
    "_createPoint": function(text) {
        // check the arguments
        var match = /^\(([^,]+),([^,]+)\)$/.exec(text);
        if (!match) {
            return new Point(0, 0);
        }

        // coordinate calculation
        var x = parseInt(match[1]);
        var y = parseInt(match[2]);
        return new Point(x, y);
    },

    // create color class from hexadecimal string
    "_createColor": function(text) {
        // check the arguments
        var lower = text.trim().toLowerCase();
        if (!/^#[0-9a-f]{6}$/.test(lower)) {
            return new Color(0, 0, 0);
        }

        // get RGB value
        var r = parseInt(lower.substr(1, 2), 16);
        var g = parseInt(lower.substr(3, 2), 16);
        var b = parseInt(lower.substr(5, 2), 16);
        return new Color(r, g, b);
    },

}

// Point creator class
var PointCreator = function(method) {
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
        var index = 0;
        var delta = angle;
        var points = [];

        // polar coordinate transformation
        for (var i = 0; i < count; i++) {
            var px = i * constant;
            var py = numbers[index] * delta;
            points.push(new Point(px, py));
            index = (index + 1) % numbers.length;
        }
        return points;
    },

    // create screw projective coordinates
    "_createScrew": function(numbers, count, constant, angle) {
        var index = 0;
        var delta = Math.PI * 2 * angle / 360;
        var px = 0;
        var py = 0;
        var points = [ new Point(px, py) ];

        // polar coordinate transformation
        for (var i = 0; i < count; i++) {
            var radius = constant;
            var theta = numbers[index] * delta;
            px += radius * Math.cos(theta);
            py += radius * Math.sin(theta);
            points.push(new Point(px, py));
            index = (index + 1) % numbers.length;
        }
        return points;
    },

    // create spiral coordinates
    "_createSpiral": function(numbers, count, constant, angle) {
        var index = 0;
        var delta = Math.PI * 2 * angle / 360;
        var radius = 0;
        var theta = 0;
        var points = [ new Point(0, 0) ];

        // polar coordinate transformation
        for (var i = 0; i < count; i++) {
            radius += constant;
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
var Color = function(r, g, b) {
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
        var r = ("0" + this.r.toString(16)).slice(-2);
        var g = ("0" + this.g.toString(16)).slice(-2);
        var b = ("0" + this.b.toString(16)).slice(-2);
        return "#" + r + g + b;
    },

}

// start the controller
new Controller();

