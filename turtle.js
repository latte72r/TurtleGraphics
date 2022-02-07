
const SHAPE = [
    [0, 14], [-2, 12], [-1, 8], [-4, 5], [-7, 7], [-9, 6],
    [-6, 3], [-7, -1], [-5, -5], [-8, -8], [-6, -10], [-4, -7],
    [0, -9], [4, -7], [6, -10], [8, -8], [5, -5], [7, -1],
    [6, 3], [9, 6], [7, 7], [4, 5], [1, 8], [2, 12], [0, 14]
];

const SPEED_TABLE = {
    0: 0, 1: 40, 2: 32, 3: 24, 4: 20, 5: 16, 6: 12, 7: 8, 8: 4, 9: 2, 10: 0
}

const DELTA_XY = 2;
const DELTA_ANGLE = 2;

class Turtle {
    constructor(width, height, canvas_id) {
        this.cvWidth = width;
        this.cvHeight = height;

        this.initializeVariables();

        this.canvas = document.getElementById(canvas_id);

        if (!this.canvas || !this.canvas.getContext) {
            return false;
        }

        this.canvas.width = this.cvWidth;
        this.canvas.height = this.cvHeight;

        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = this.fillColor;
        this.context.strokeStyle = this.penColor;
        this.context.lineWidth = this.lineWidth;
        this.moveTurtle();
    }

    initializeVariables() {
        this.registeredFigures = [];

        this.directionAngle = 0;
        this.centerX = this.cvWidth / 2;
        this.centerY = this.cvHeight / 2;

        this.penColor = "#79E5E2";
        this.fillColor = "#A9F5F2";
        this.lineWidth = 1;
        this.penEnabled = true;
        this.turtleVisible = true;
        this.turtleSpeed = 3;
        this.delayTime = SPEED_TABLE[this.turtleSpeed];
        this.turtleExpand = 1;
    }

    sleep(waitTime) {
        return new Promise(resolve => setTimeout(resolve, waitTime));
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

    resetscreen() {
        this.initializeVariables();
        this.moveTurtle();
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
                if (this.penEnabled) {
                    this.clearCanvas();
                    this.drawLine(START_X, START_Y, this.centerX, this.centerY);
                    this.moveTurtle(false);
                } else {
                    this.moveTurtle();
                }
                await this.sleep(this.delayTime);
            }
        } else {
            await this.sleep(this.delayTime);
        }
        this.centerX = START_X + distance * COS;
        this.centerY = START_Y - distance * SIN;
        if (this.penEnabled) {
            this.registeredFigures.push(
                ["line", [START_X, START_Y, this.centerX, this.centerY]]);
        }
        this.moveTurtle();
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
                this.moveTurtle();
                await this.sleep(this.delayTime);
            }
        } else {
            await this.sleep(this.delayTime);
        }
        this.directionAngle = START_ANGLE - angle;
        this.moveTurtle();
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
                this.moveTurtle();
                await this.sleep(this.delayTime);
            }
        } else {
            await this.sleep(this.delayTime);
        }
        this.directionAngle = START_ANGLE + angle;
        this.moveTurtle();
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
        this.moveTurtle();
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
        this.moveTurtle();
    }

    convertRGB(red, green, blue) {
        let rgb = "#";
        rgb += ("00" + red.toString(16)).slice(-2);
        rgb += ("00" + green.toString(16)).slice(-2);
        rgb += ("00" + blue.toString(16)).slice(-2);
        return rgb.toUpperCase();
    }

    pencolor(...args) {
        if (typeof (args[0]) == "string") {
            this.penColor = args[0];
        } else {
            this.penColor = this.convertRGB(...args);
        }
        this.context.strokeStyle = this.penColor;
        this.registeredFigures.push(["pencolor", this.penColor]);
        this.moveTurtle();
    }

    fillcolor(...args) {
        if (typeof (args[0]) == "string") {
            this.fillColor = args[0];
        } else {
            this.fillColor = this.convertRGB(...args);
        }
        this.context.fillStyle = this.fillColor;
        this.registeredFigures.push(["fillcolor", this.fillColor]);
        this.moveTurtle();
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
        this.moveTurtle();
    }

    hideturtle() {
        this.turtleVisible = false;
        this.moveTurtle();
    }

    drawTurtle(
        centerX = NaN, centerY = NaN, directionAngle = NaN,
        penColor = NaN, fillColor = NaN, lineWidth = NaN, turtleExpand = NaN) {
        if (isNaN(centerX)) { centerX = this.centerX; }
        if (isNaN(centerY)) { centerY = this.centerY; }
        if (isNaN(directionAngle)) { directionAngle = this.directionAngle; }
        if (isNaN(penColor)) { penColor = this.penColor; }
        if (isNaN(fillColor)) { fillColor = this.fillColor; }
        if (isNaN(lineWidth)) { lineWidth = this.lineWidth; }
        if (isNaN(turtleExpand)) { turtleExpand = this.turtleExpand; }
        this.context.strokeStyle = penColor;
        this.context.fillStyle = fillColor;
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
        this.moveTurtle();
    }

    stamp() {
        this.registeredFigures.push(["stamp", [
            this.centerX, this.centerY, this.directionAngle,
            this.penColor, this.fillColor, this.lineWidth, this.turtleExpand]]);
        this.moveTurtle();
    }

    moveTurtle(clear = true) {
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
        document.getElementById("textarea").style.cssFloat = "left";
    } else {
        document.getElementById("textarea").style.cssFloat = "right";
    }
    try {
        turtle = new Turtle(800, 560, "canvas");
    } catch (error) {
        alert(error.message);
    }
}

let running = false;
async function runCode() {
    const CODE = document.getElementById("textarea").value;
    const INIT = document.getElementById("initialize").checked;
    if (INIT) {
        turtle.resetscreen();
    }
    if (CODE == "") {
        alert("A program code was not entered.");
    } else if (running) {
        alert("Another program is running.");
    } else {
        running = true;
        await eval("(async () => {try {" + CODE + "} catch(e) {alert(e.message)}})()");
        running = false;
    }
}
