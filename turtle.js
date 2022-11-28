
const SHAPE = [
    [0, 14], [-2, 12], [-1, 8], [-4, 5], [-7, 7], [-9, 6],
    [-6, 3], [-7, -1], [-5, -5], [-8, -8], [-6, -10], [-4, -7],
    [0, -9], [4, -7], [6, -10], [8, -8], [5, -5], [7, -1],
    [6, 3], [9, 6], [7, 7], [4, 5], [1, 8], [2, 12], [0, 14]
];

const SPEED_TABLE = {
    0: 0, 1: 32, 2: 24, 3: 20, 4: 16, 5: 14, 6: 12, 7: 8, 8: 6, 9: 4, 10: 2
};

const DELTA_XY = 2;
const DELTA_ANGLE = 2;

class Turtle {
    constructor(width, height, canvasId) {
        this.cvWidth = width;
        this.cvHeight = height;

        this.canvas = document.getElementById(canvasId);

        if (!this.canvas || !this.canvas.getContext) {
            return false;
        }

        this.canvas.width = this.cvWidth;
        this.canvas.height = this.cvHeight;

        this.context = this.canvas.getContext('2d');
        this.resetscreen();
    }

    resetscreen() {
        this.registeredFigures = [];

        this.directionAngle = 0;
        this.centerX = this.cvWidth / 2;
        this.centerY = this.cvHeight / 2;

        this.pencolor("#000000");
        this.fillcolor("#000000");
        this.pensize(1);

        this.pendown();
        this.showturtle();
        this.speed(3);
        this.turtlesize(1);

        this.redrawObjects();
    }

    async sleep(second) {
        await this.sleepMS(second * 1000);
    }

    sleepMS(milSecond) {
        return new Promise(resolve => setTimeout(resolve, milSecond));
    }

    drawLine(fromX, fromY, toX, toY) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.cvWidth, this.cvHeight);
    }

    pensize(width) {
        this.penSize = width;
        this.registeredFigures.push(["pensize", width]);
    }

    async forward(distance) {
        const SIGN = distance > 0 ? 1 : -1;
        const TIMES = distance * SIGN / DELTA_XY;
        const START_X = this.centerX;
        const START_Y = this.centerY;
        const COS = Math.cos(this.directionAngle / 180 * Math.PI);
        const SIN = Math.sin(this.directionAngle / 180 * Math.PI);
        if (this.turtleSpeed != 0) {
            for (let i = 0; i < TIMES; i++) {
                this.centerX += DELTA_XY * COS * SIGN;
                this.centerY -= DELTA_XY * SIN * SIGN;
                this.redrawObjects();
                if (this.penEnabled) {
                    this.drawLine(START_X, START_Y, this.centerX, this.centerY);
                }
                await this.sleepMS(this.delayTime);
            }
        }
        this.centerX = START_X + distance * COS;
        this.centerY = START_Y - distance * SIN;
        if (this.penEnabled) {
            this.registeredFigures.push(
                ["line", [START_X, START_Y, this.centerX, this.centerY]]);
        }
        this.redrawObjects();
    }

    async backward(distance) {
        await this.forward(-distance);
    }

    async right(angle) {
        if (angle < 0) {
            await this.left(-angle);
            return;
        }
        const TIMES = angle / DELTA_ANGLE;
        const START_ANGLE = this.directionAngle;
        if (this.turtleSpeed != 0) {
            for (let i = 0; i < TIMES; i++) {
                this.directionAngle -= DELTA_ANGLE;
                this.redrawObjects();
                await this.sleepMS(this.delayTime);
            }
        }
        this.directionAngle = START_ANGLE - angle;
        this.redrawObjects();
    }

    async left(angle) {
        if (angle < 0) {
            await this.right(-angle);
            return;
        }
        const TIMES = angle / DELTA_ANGLE;
        const START_ANGLE = this.directionAngle;
        if (this.turtleSpeed != 0) {
            for (let i = 0; i < TIMES; i++) {
                this.directionAngle += DELTA_ANGLE;
                this.redrawObjects();
                await this.sleepMS(this.delayTime);
            }
        }
        this.directionAngle = START_ANGLE + angle;
        this.redrawObjects();
    }

    async goto(x, y) {
        x += this.cvWidth / 2;
        y += this.cvHeight / 2;
        const DELTA_X = x - this.centerX;
        const DELTA_Y = y - this.centerY;
        const ANGLE = -(Math.atan2(DELTA_Y, DELTA_X) / Math.PI) * 180;
        const DISTANCE = Math.sqrt(Math.pow(DELTA_X, 2) + Math.pow(DELTA_Y, 2));
        await this.setheading(ANGLE);
        await this.forward(DISTANCE);
        this.directionAngle = ANGLE;
        this.centerX = x;
        this.centerY = y;
        this.redrawObjects();
    }

    async home() {
        await this.goto(0, 0);
    }

    async setx(x) {
        x += this.cvWidth / 2;
        await this.goto(x, this.centerY);
    }

    async sety(y) {
        y += this.cvHeight / 2;
        await this.goto(this.centerX, y);
    }

    angleFitRange(angle) {
        angle = angle % 360;
        if ((angle <= 180) && (angle >= -180)) {
            return angle;
        } else if ((angle - 360 <= 180) && (angle - 360 >= -180)) {
            return angle - 360;
        } else {
            return angle + 360;
        }
    }

    async setheading(to_angle) {
        const ANGLE = this.angleFitRange(to_angle - this.directionAngle);
        if (ANGLE > 0) {
            await this.left(ANGLE);
        } else {
            await this.right(-ANGLE);
        }
        this.directionAngle = to_angle;
        this.redrawObjects();
    }

    convertRGB(red, green, blue) {
        let rgb = "#";
        rgb += ("00" + red.toString(16)).slice(-2);
        rgb += ("00" + green.toString(16)).slice(-2);
        rgb += ("00" + blue.toString(16)).slice(-2);
        return rgb.toUpperCase();
    }

    pencolor(...args) {
        let penColor;
        if (typeof (args[0]) == "string") {
            penColor = args[0];
        } else {
            penColor = this.convertRGB(...args);
        }
        this.registeredFigures.push(["pencolor", penColor]);
        this.redrawObjects();
    }

    fillcolor(...args) {
        let fillColor;
        if (typeof (args[0]) == "string") {
            fillColor = args[0];
        } else {
            fillColor = this.convertRGB(...args);
        }
        this.registeredFigures.push(["fillcolor", fillColor]);
        this.redrawObjects();
    }

    color(...args) {
        if (typeof (args[0]) == "string") {
            this.pencolor(...args);
            this.fillcolor(...args);
        }
    }

    penup() {
        this.penEnabled = false;
    }

    pendown() {
        this.penEnabled = true;
    }

    speed(speed) {
        this.turtleSpeed = speed;
        this.delayTime = SPEED_TABLE[this.turtleSpeed];
    }

    showturtle() {
        this.turtleVisible = true;
        this.redrawObjects();
    }

    hideturtle() {
        this.turtleVisible = false;
        this.redrawObjects();
    }

    drawTurtle(centerX = NaN, centerY = NaN, directionAngle = NaN, turtleExpand = NaN) {
        if (isNaN(centerX)) { centerX = this.centerX; }
        if (isNaN(centerY)) { centerY = this.centerY; }
        if (isNaN(directionAngle)) { directionAngle = this.directionAngle; }
        if (isNaN(turtleExpand)) { turtleExpand = this.turtleExpand; }
        const RADIAN = (directionAngle - 90) / 180 * Math.PI;
        const COS = Math.cos(RADIAN);
        const SIN = Math.sin(RADIAN);
        this.context.beginPath();
        SHAPE.forEach(element => this.context.lineTo(
            centerX + (element[0] * COS - element[1] * SIN) * turtleExpand,
            centerY - (element[0] * SIN + element[1] * COS) * turtleExpand));
        this.context.fill();
        this.context.stroke();
    }

    turtlesize(stretch) {
        this.turtleExpand = stretch;
        this.redrawObjects();
    }

    stamp() {
        this.registeredFigures.push(["stamp", [
            this.centerX, this.centerY, this.directionAngle, this.turtleExpand]]);
        this.redrawObjects();
    }

    dot(size) {
        this.registeredFigures.push(["dot", [this.centerX, this.centerY, size]]);
        this.redrawObjects();
    }

    createDot(centerX, centerY, size) {
        this.context.beginPath();
        this.context.arc(centerX, centerY, size / 2, 0, 360 * Math.PI, false);
        this.context.fill();
    }

    redrawObjects(clear = true) {
        if (clear) {
            this.clearCanvas();
        }
        for (let i = 0; i < this.registeredFigures.length; i++) {
            let figure = this.registeredFigures[i];
            if (figure[0] == "line") {
                this.drawLine(...figure[1]);
            } else if (figure[0] == "pencolor") {
                this.context.strokeStyle = figure[1];
            } else if (figure[0] == "fillcolor") {
                this.context.fillStyle = figure[1];
            } else if (figure[0] == "stamp") {
                this.drawTurtle(...figure[1]);
            } else if (figure[0] == "dot") {
                this.createDot(...figure[1]);
            } else if (figure[0] == "pensize") {
                this.context.lineWidth = figure[1];
            }
        }
        if (this.turtleVisible) {
            this.drawTurtle();
        }
    }
}

let turtle;
function setupTurtle() {
    let ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        document.getElementById("right-side").style.cssFloat = "left";
    } else {
        document.getElementById("right-side").style.cssFloat = "right";
    }
    try {
        turtle = new Turtle(800, 560, "canvas");
    } catch (error) {
        alert(error.message);
    }
}

let running = false;
async function runCode() {
    const CODE = document.getElementById("textbox").value;
    const INIT = document.getElementById("initialize").checked;
    if (CODE == "") {
        alert("A program code was not entered.");
    } else if (running) {
        alert("Another program is running.");
    } else {
        if (INIT) {
            turtle.resetscreen();
        }
        running = true;
        await eval("(async () => {try {" + CODE + "} catch(e) {alert(e.message)}})()");
        running = false;
    }
}
