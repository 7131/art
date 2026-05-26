// Controller class
class Controller {
    #patternText;
    #boardCanvas;

    // constructor
    constructor() {
        window.addEventListener("load", this.#initialize.bind(this));
    }

    // initialize the private fields
    #initialize(e) {
        // DOM elements
        this.#patternText = document.getElementById("pattern");
        this.#boardCanvas = document.getElementById("board");
        const drawButton = document.getElementById("draw");

        // events
        drawButton.addEventListener("click", this.#draw.bind(this));
    }

    // "Draw" button process
    #draw(e) {
        // get the pattern
        const letters = this.#patternText.value.toLowerCase().split("");
        const numbers = letters.map(elem => parseInt(elem, 36)).filter(elem => !isNaN(elem));
        const points = this.#createPoints(numbers);

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
    #createPoints(numbers) {
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
    }

}

// start the controller
new Controller();

