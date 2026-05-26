// Controller class
class Controller {
    #patternText;
    #widthLabel;
    #heightLabel;
    #countLabel;
    #constantLabel;
    #deltaLabel;
    #widthSlider;
    #heightSlider;
    #countSlider;
    #constantSlider;
    #deltaSlider;
    #boardCanvas;

    // constructor
    constructor() {
        window.addEventListener("load", this.#initialize.bind(this));
    }

    // initialize the private fields
    #initialize(e) {
        // DOM elements
        this.#patternText = document.getElementById("pattern");
        this.#widthLabel = document.getElementById("width_value");
        this.#heightLabel = document.getElementById("height_value");
        this.#countLabel = document.getElementById("count_value");
        this.#constantLabel = document.getElementById("constant_value");
        this.#deltaLabel = document.getElementById("delta_value");
        this.#widthSlider = document.getElementById("width");
        this.#heightSlider = document.getElementById("height");
        this.#countSlider = document.getElementById("count");
        this.#constantSlider = document.getElementById("constant");
        this.#deltaSlider = document.getElementById("delta");
        this.#boardCanvas = document.getElementById("board");
        const drawButton = document.getElementById("draw");

        // events
        this.#widthSlider.addEventListener("input", this.#changeWidthSlider.bind(this));
        this.#heightSlider.addEventListener("input", this.#changeHeightSlider.bind(this));
        this.#countSlider.addEventListener("input", this.#changeCountSlider.bind(this));
        this.#constantSlider.addEventListener("input", this.#changeConstantSlider.bind(this));
        this.#deltaSlider.addEventListener("input", this.#changeDeltaSlider.bind(this));
        drawButton.addEventListener("click", this.#drawCanvas.bind(this));
    }

    // canvas width slider process
    #changeWidthSlider(e) {
        const width = this.#widthSlider.value;
        this.#widthLabel.textContent = width;
        this.#boardCanvas.width = width;
        this.#draw();
    }

    // canvas height slider process
    #changeHeightSlider(e) {
        const height = this.#heightSlider.value;
        this.#heightLabel.textContent = height;
        this.#boardCanvas.height = height;
        this.#draw();
    }

    // "Number of segments" slider process
    #changeCountSlider(e) {
        this.#countLabel.textContent = this.#countSlider.value;
        this.#draw();
    }

    // "Increase in length" slider process
    #changeConstantSlider(e) {
        // get the slider value
        const value = parseInt(this.#constantSlider.value, 10);
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
        this.#constantLabel.textContent = text;
        this.#draw();
    }

    // "Increase in angle" slider process
    #changeDeltaSlider(e) {
        this.#deltaLabel.textContent = this.#deltaSlider.value;
        this.#draw();
    }

    // "Draw" button process
    #drawCanvas(e) {
        this.#draw();
    }

    // draw on the canvas
    #draw() {
        // get settings
        const count = parseInt(this.#countLabel.textContent, 10);
        const constant = parseFloat(this.#constantLabel.textContent);
        const delta = parseInt(this.#deltaLabel.textContent, 10);

        // get the pattern
        const letters = this.#patternText.value.toLowerCase().split("");
        const numbers = letters.map(elem => parseInt(elem, 36)).filter(elem => !isNaN(elem));
        const points = this.#createPoints(numbers, count, constant, delta);

        // get drawing context
        const context = this.#boardCanvas.getContext("2d");
        context.clearRect(0, 0, this.#boardCanvas.width, this.#boardCanvas.height);
        context.beginPath();

        // draw line segments
        const cx = this.#boardCanvas.width / 2;
        const cy = this.#boardCanvas.height / 2;
        context.moveTo(cx, cy);
        points.forEach(elem => context.lineTo(cx + elem.x, cy - elem.y));
        context.stroke();
    }

    // create points
    #createPoints(numbers, count, constant, angle) {
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
    }

}

// start the controller
new Controller();

