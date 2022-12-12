
const SHAPE = [
    [0, 14], [-2, 12], [-1, 8], [-4, 5], [-7, 7], [-9, 6],
    [-6, 3], [-7, -1], [-5, -5], [-8, -8], [-6, -10], [-4, -7],
    [0, -9], [4, -7], [6, -10], [8, -8], [5, -5], [7, -1],
    [6, 3], [9, 6], [7, 7], [4, 5], [1, 8], [2, 12], [0, 14]
];

const SPEED_TABLE = {
    0: 0, 1: 32, 2: 24, 3: 20, 4: 16, 5: 14, 6: 12, 7: 8, 8: 6, 9: 4, 10: 2
};

const DELTA_XY = 4;
const DELTA_ANGLE = 4;
const DELTA_CIRCLE = 4;

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
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.resetscreen();
    }

    resetscreen() {
        this.registeredFigures = [];
        this.filledFigures = [];

        this.directionAngle = 0;
        this.centerX = this.cvWidth / 2;
        this.centerY = this.cvHeight / 2;
        this.beginFillIndex = null;

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
                if (this.turtleVisible) {
                    this.drawTurtle();
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
        rgb += ("00" + parseInt(red).toString(16)).slice(-2);
        rgb += ("00" + parseInt(green).toString(16)).slice(-2);
        rgb += ("00" + parseInt(blue).toString(16)).slice(-2);
        return rgb.toUpperCase();
    }

    pencolor(...args) {
        let penColor;
        if ((typeof (args[0]) == "string") && (args.length == 1)) {
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
        if (args.length == 1 || args.length == 3) {
            this.pencolor(...args);
            this.fillcolor(...args);
        }
        if (args.length == 2) {
            this.pencolor(args[0]);
            this.fillcolor(args[1]);
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
        this.context.lineWidth = this.turtleExpand;
        SHAPE.forEach(element => this.context.lineTo(
            centerX + (element[0] * COS - element[1] * SIN) * turtleExpand,
            centerY - (element[0] * SIN + element[1] * COS) * turtleExpand));
        this.context.fill();
        this.context.stroke();
        this.context.lineWidth = this.penSize;
    }

    turtlesize(stretch) {
        this.registeredFigures.push(["turtlesize", stretch]);
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

    async circle(radius, extent) {
        const START_X = this.centerX;
        const START_Y = this.centerY;
        const START_ANGLE = this.directionAngle;
        const SIGN = radius > 0 ? 1 : -1;
        const RADIAN = (START_ANGLE + 90 * SIGN) / 180 * Math.PI;
        const CENTER_X = START_X + radius * Math.cos(RADIAN) * SIGN;
        const CENTER_Y = START_Y - radius * Math.sin(RADIAN) * SIGN;
        const TIMES = (radius * extent / 180 * Math.PI * SIGN) / DELTA_CIRCLE;
        const START = (90 * SIGN - START_ANGLE) / 180 * Math.PI;
        const END = ((90 - extent) * SIGN - START_ANGLE) / 180 * Math.PI;
        if (this.turtleSpeed != 0 && radius != 0) {
            for (let i = 0; i < TIMES; i++) {
                let end = START + (END - START) / TIMES * i;
                this.centerX = CENTER_X + radius * Math.cos(end) * SIGN;
                this.centerY = CENTER_Y + radius * Math.sin(end) * SIGN;
                this.directionAngle = 90 * SIGN - end / Math.PI * 180;
                this.redrawObjects();
                if (this.penEnabled) {
                    this.context.beginPath();
                    this.context.arc(CENTER_X, CENTER_Y, radius * SIGN, START, end, radius > 0 ? true : false);
                    this.context.stroke();
                }
                if (this.turtleVisible) {
                    this.drawTurtle();
                }
                await this.sleepMS(this.delayTime);
            }
        }
        this.centerX = CENTER_X + radius * Math.cos(END) * SIGN;
        this.centerY = CENTER_Y + radius * Math.sin(END) * SIGN;
        this.directionAngle = 90 * SIGN - END / Math.PI * 180;
        if (this.penEnabled) {
            this.registeredFigures.push(["circle", [radius, CENTER_X, CENTER_Y, START, END, SIGN]]);
        }
        this.redrawObjects();
    }

    createCircle(radius, centerX, centerY, start, end, sign) {
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius * sign, start, end, radius > 0 ? true : false);
        this.context.stroke();
    }

    begin_fill() {
        this.beginFillIndex = this.registeredFigures.length;
        this.registeredFigures.push(["begin_fill", [this.registeredFigures.length + 1, null, null]]);
        this.redrawObjects();
    }

    beginFill(beginIndex, endIndex, fillStyle) {
        if (endIndex === null) {
            return;
        }
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        for (let i = beginIndex; i < endIndex; i++) {
            let figure = this.registeredFigures[i];
            if (figure[0] == "line") {
                this.fillLine(...figure[1]);
            } else if (figure[0] == "circle") {
                this.fillCircle(...figure[1]);
            }
        }
        this.context.closePath();
        this.context.fill("evenodd");
    }

    end_fill() {
        if (this.beginFillIndex === null) {
            return;
        }
        this.registeredFigures[this.beginFillIndex][1][1] = this.registeredFigures.length;
        this.registeredFigures[this.beginFillIndex][1][2] = this.context.fillStyle;
        this.beginFillIndex = null;
        this.redrawObjects();
    }

    fillLine(fromX, fromY, toX, toY) {
        this.context.lineTo(toX, toY);
    }

    fillCircle(radius, centerX, centerY, start, end, sign) {
        this.context.arc(centerX, centerY, radius * sign, start, end, radius > 0 ? true : false);
    }

    position() {
        return (this.centerX, this.centerY);
    }

    redrawObjects(turtle = true) {
        this.clearCanvas();
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
            } else if (figure[0] == "turtlesize") {
                this.turtleExpand = figure[1];
            } else if (figure[0] == "dot") {
                this.createDot(...figure[1]);
            } else if (figure[0] == "circle") {
                this.createCircle(...figure[1]);
            } else if (figure[0] == "pensize") {
                this.penSize = figure[1];
                this.context.lineWidth = figure[1];
            } else if (figure[0] == "begin_fill") {
                this.beginFill(...figure[1]);
            }
        }
        if (this.turtleVisible && turtle) {
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
        turtle = new Turtle(800, 600, "canvas");
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
