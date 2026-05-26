// Color class
class Color {

    // constructor
    constructor(r, g, b) {
        this.r = Math.floor(r) % 256;
        this.g = Math.floor(g) % 256;
        this.b = Math.floor(b) % 256;
    }

    // parse hexadecimal string
    static fromHex(text) {
        const match = /^#?([0-9a-fA-F]{6})$/.exec(text.trim());
        if (!match) {
            return new Color(0, 0, 0);
        }
        const r = parseInt(match[1].substring(0, 2), 16);
        const g = parseInt(match[1].substring(2, 4), 16);
        const b = parseInt(match[1].substring(4, 6), 16);
        return new Color(r, g, b);
    }

    // add color circulation
    addColor(color) {
        this.r = (this.r + color.r) % 256;
        this.g = (this.g + color.g) % 256;
        this.b = (this.b + color.b) % 256;
    }

    // get hexadecimal string
    toHex() {
        const r = `0${this.r.toString(16)}`.slice(-2);
        const g = `0${this.g.toString(16)}`.slice(-2);
        const b = `0${this.b.toString(16)}`.slice(-2);
        return `#${r}${g}${b}`;
    }

}

// Point class
class Point {

    // constructor
    constructor(x, y) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    // parse coordinate string
    static fromString(text) {
        const match = /^\((-?\d+),(-?\d+)\)$/.exec(text);
        if (!match) {
            return new Point(0, 0);
        }
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        return new Point(x, y);
    }

    // get coordinate string
    toString() {
        return `(${this.x},${this.y})`;
    }

}

// Point creator class
class PointCreator {

    // constructor
    constructor(method) {
        switch (method) {
            case "spectral":
                this.create = this.#createSpectral;
                break;
            case "screw":
                this.create = this.#createScrew;
                break;
            default:
                this.create = this.#createSpiral;
                break;
        }
    }

    // create spectral coordinates
    #createSpectral(numbers, count, constant, angle) {
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
    }

    // create screw projective coordinates
    #createScrew(numbers, count, constant, angle) {
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
    }

    // create spiral coordinates
    #createSpiral(numbers, count, constant, angle) {
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
    }

}

// Controller class
class Controller {
    #patternText;
    #widthText;
    #heightText;
    #countText;
    #constantText;
    #deltaText;
    #colorInit;
    #colorStep;
    #widthSlider;
    #heightSlider;
    #countSlider;
    #constantSlider;
    #deltaSlider;
    #boardCanvas;
    #centerLabel;
    #methodRadios;
    #mouse = new Point(0, 0);
    #center = new Point(0, 0);

    // constructor
    constructor() {
        window.addEventListener("load", this.#initialize.bind(this));
    }

    // initialize the private fields
    #initialize(e) {
        // DOM elements
        this.#patternText = document.getElementById("pattern");
        this.#widthText = document.getElementById("width_value");
        this.#heightText = document.getElementById("height_value");
        this.#countText = document.getElementById("count_value");
        this.#constantText = document.getElementById("constant_value");
        this.#deltaText = document.getElementById("delta_value");
        this.#colorInit = document.getElementById("color_init");
        this.#colorStep = document.getElementById("color_step");
        this.#widthSlider = document.getElementById("width");
        this.#heightSlider = document.getElementById("height");
        this.#countSlider = document.getElementById("count");
        this.#constantSlider = document.getElementById("constant");
        this.#deltaSlider = document.getElementById("delta");
        this.#boardCanvas = document.getElementById("board");
        this.#centerLabel = document.getElementById("center");
        this.#methodRadios = Array.from(document.getElementsByName("method"));

        // common events
        this.#patternText.addEventListener("change", this.#drawCanvas.bind(this));
        this.#widthText.addEventListener("change", this.#changeWidthText.bind(this));
        this.#heightText.addEventListener("change", this.#changeHeightText.bind(this));
        this.#countText.addEventListener("change", this.#changeCountText.bind(this));
        this.#constantText.addEventListener("change", this.#changeConstantText.bind(this));
        this.#deltaText.addEventListener("change", this.#changeDeltaText.bind(this));
        this.#colorInit.addEventListener("change", this.#drawCanvas.bind(this));
        this.#colorStep.addEventListener("change", this.#drawCanvas.bind(this));
        this.#widthSlider.addEventListener("input", this.#changeWidthSlider.bind(this));
        this.#heightSlider.addEventListener("input", this.#changeHeightSlider.bind(this));
        this.#countSlider.addEventListener("input", this.#changeCountSlider.bind(this));
        this.#constantSlider.addEventListener("input", this.#changeConstantSlider.bind(this));
        this.#deltaSlider.addEventListener("input", this.#changeDeltaSlider.bind(this));
        this.#methodRadios.forEach(elem => elem.addEventListener("change", this.#drawCanvas.bind(this)));

        // drag events
        this.#boardCanvas.addEventListener("mousedown", this.#beginMouseDrag.bind(this));
        this.#boardCanvas.addEventListener("mousemove", this.#doMouseDrag.bind(this));
        this.#boardCanvas.addEventListener("touchstart", this.#beginTouchDrag.bind(this));
        this.#boardCanvas.addEventListener("touchmove", this.#doTouchDrag.bind(this), { "passive": false });

        // initial drawing
        this.#draw();
    }

    // "Draw" button process
    #drawCanvas(e) {
        this.#draw();
    }

    // canvas width text process
    #changeWidthText(e) {
        this.#setValue(this.#widthText, this.#widthSlider);
        this.#changeArea();
    }

    // canvas height text process
    #changeHeightText(e) {
        this.#setValue(this.#heightText, this.#heightSlider);
        this.#changeArea();
    }

    // "Number of segments" text process
    #changeCountText(e) {
        this.#setScale(this.#countText, this.#countSlider);
        this.#draw();
    }

    // "Increase in length" text process
    #changeConstantText(e) {
        this.#setScale(this.#constantText, this.#constantSlider);
        this.#draw();
    }

    // "Increase in angle" text process
    #changeDeltaText(e) {
        this.#setValue(this.#deltaText, this.#deltaSlider);
        this.#draw();
    }

    // canvas width slider process
    #changeWidthSlider(e) {
        this.#widthText.value = this.#widthSlider.value;
        this.#changeArea();
    }

    // canvas height slider process
    #changeHeightSlider(e) {
        this.#heightText.value = this.#heightSlider.value;
        this.#changeArea();
    }

    // "Number of segments" slider process
    #changeCountSlider(e) {
        this.#countText.value = this.#toScale(this.#countSlider.value);
        this.#draw();
    }

    // "Increase in length" slider process
    #changeConstantSlider(e) {
        this.#constantText.value = this.#toScale(this.#constantSlider.value);
        this.#draw();
    }

    // "Increase in angle" slider process
    #changeDeltaSlider(e) {
        this.#deltaText.value = this.#deltaSlider.value;
        this.#draw();
    }

    // start dragging with mouse
    #beginMouseDrag(e) {
        this.#mouse.x = e.pageX;
        this.#mouse.y = e.pageY;
        this.#center = Point.fromString(this.#centerLabel.textContent);
    }

    // drag processing with mouse
    #doMouseDrag(e) {
        // whether left click
        if ((e.buttons & 0x0001) == 0) {
            return;
        }

        // coordinate calculation
        const dx = Math.round(e.pageX - this.#mouse.x);
        const dy = Math.round(this.#mouse.y - e.pageY);
        const center = new Point(this.#center.x + dx, this.#center.y + dy);

        // draw
        this.#centerLabel.textContent = center.toString();
        this.#draw();
    }

    // start dragging by touch
    #beginTouchDrag(e) {
        // whether touched with two fingers
        if (e.touches.length != 2) {
            return;
        }

        // coordinate calculation
        this.#mouse.x = e.touches[0].pageX;
        this.#mouse.y = e.touches[0].pageY;
        this.#center = Point.fromString(this.#centerLabel.textContent);
    }

    // drag processing by touch
    #doTouchDrag(e) {
        // whether touched with two fingers
        if (e.targetTouches.length != 2) {
            return;
        }
        const first = e.targetTouches[0];
        const second = e.targetTouches[1];
        if (first.offsetX < 0 || this.#boardCanvas.width < first.offsetX || first.offsetY < 0 || this.#boardCanvas.height < first.offsetY) {
            return;
        }
        if (second.offsetX < 0 || this.#boardCanvas.width < second.offsetX || second.offsetY < 0 || this.#boardCanvas.height < second.offsetY) {
            return;
        }
        e.preventDefault();

        // coordinate calculation
        const dx = Math.round(e.touches[0].pageX - this.#mouse.x);
        const dy = Math.round(this.#mouse.y - e.touches[0].pageY);
        const center = new Point(this.#center.x + dx, this.#center.y + dy);

        // draw
        this.#centerLabel.textContent = center.toString();
        this.#draw();
    }

    // draw on the canvas
    #draw() {
        // get settings
        const center = Point.fromString(this.#centerLabel.textContent);
        const count = parseInt(this.#countText.value, 10);
        const constant = parseFloat(this.#constantText.value);
        const delta = parseInt(this.#deltaText.value, 10);
        const color = Color.fromHex(this.#colorInit.value);
        const step = Color.fromHex(this.#colorStep.value);

        // formulas for drawing
        const radio = this.#methodRadios.find(elem => elem.checked);
        const creator = new PointCreator(radio.value);

        // get the pattern
        const letters = this.#patternText.value.toLowerCase().split("");
        const numbers = letters.map(elem => parseInt(elem, 36)).filter(elem => !isNaN(elem));
        const points = creator.create(numbers, count, constant, delta);

        // get drawing context
        const context = this.#boardCanvas.getContext("2d");
        context.clearRect(0, 0, this.#boardCanvas.width, this.#boardCanvas.height);

        // draw line segments
        const cx = this.#boardCanvas.width / 2 + center.x;
        const cy = this.#boardCanvas.height / 2 - center.y;
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
    }

    // set the value to slider and text
    #setValue(text, slider) {
        // get the value
        let value = parseInt(text.value, 10);
        if (isNaN(value)) {
            value = slider.min;
        }

        // reset the value
        slider.value = value;
        text.value = slider.value;
    }

    // set the scale to slider and text
    #setScale(text, slider) {
        slider.value = this.#fromScale(text.value, slider.min);
        text.value = this.#toScale(slider.value);
    }

    // resize
    #changeArea() {
        // get the settings
        const width = parseInt(this.#widthText.value, 10);
        const height = parseInt(this.#heightText.value, 10);

        // change the drawing size
        this.#boardCanvas.width = width;
        this.#boardCanvas.height = height;
        this.#draw();
    }

    // convert integer to scale value
    #toScale(input) {
        // get the integer value
        const value = parseInt(input, 10);
        if (isNaN(value)) {
            return "";
        }
        const scale = Math.floor(value / 9);
        const number = (value % 9) + 1;

        // convert to scale value (treated as a string due to error)
        if (scale < 0) {
            return `0.${"0".repeat(-scale - 1)}${(number + 8) % 9 + 1}`;
        } else {
            return `${number}${"0".repeat(scale)}`;
        }
    }

    // convert from scale value to integer
    #fromScale(input, min) {
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
    }

}

// start the controller
new Controller();

