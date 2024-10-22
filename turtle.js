"use strict";
// (c) 2022-2024 Ryo Fujinami.
const SHAPE = [
    [0, 14], [-2, 12], [-1, 8], [-4, 5], [-7, 7], [-9, 6],
    [-6, 3], [-7, -1], [-5, -5], [-8, -8], [-6, -10], [-4, -7],
    [0, -9], [4, -7], [6, -10], [8, -8], [5, -5], [7, -1],
    [6, 3], [9, 6], [7, 7], [4, 5], [1, 8], [2, 12], [0, 14]
];
const SPEED_TABLE = {
    0: 0, 1: 40, 2: 36, 3: 30, 4: 22, 5: 16, 6: 12, 7: 8, 8: 6, 9: 4, 10: 2
};
const DELTA_XY = 4;
const DELTA_ANGLE = 4;
const DELTA_CIRCLE = 4;
class Turtle {
    canvas;
    context;
    cvWidth;
    cvHeight;
    running;
    registeredFigures;
    registeredCommands;
    directionAngle;
    centerX;
    centerY;
    beginFillIndex;
    penColor;
    fillColor;
    bgColor;
    penSize;
    turtleSize;
    turtleExpand;
    penEnabled;
    turtleVisible;
    delayTime;
    constructor(width, height, canvasID) {
        this.cvWidth = width;
        this.cvHeight = height;
        this.canvas = document.getElementById(canvasID);
        if (!this.canvas || !this.canvas.getContext) {
            alert("初期化できませんでした。");
            return;
        }
        this.canvas.width = this.cvWidth;
        this.canvas.height = this.cvHeight;
        this.context = this.canvas.getContext('2d');
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.reset();
    }
    reset() {
        this.running = 0;
        this.registeredFigures = [];
        this.registeredCommands = [];
        this.directionAngle = 0;
        this.centerX = this.cvWidth / 2;
        this.centerY = this.cvHeight / 2;
        this.beginFillIndex = NaN;
        this.penColor = "#000000";
        this.fillColor = "#000000";
        this.bgColor = "#FFFFFF";
        this.penSize = 1;
        this.turtleSize = 1;
        this.penEnabled = true;
        this.turtleVisible = true;
        this.delayTime = SPEED_TABLE[6];
        this.registeredFigures.push(["pencolor", this.penColor]);
        this.registeredFigures.push(["fillcolor", this.fillColor]);
        this.registeredFigures.push(["bgcolor", this.bgColor]);
        this.registeredFigures.push(["pensize", this.penSize]);
        this.registeredFigures.push(["turtlesize", this.turtleSize]);
        this._redrawObjects();
    }
    async sleep(secs) {
        this.registeredCommands.push(["sleep", this.registeredFigures.length, [secs]]);
        await this._sleep(secs);
    }
    async _sleep(secs) {
        for (let i = 0; i < secs * 1000 / this.delayTime; i++) {
            await this._delayProgram();
        }
    }
    _sleepMS(milSecond) {
        return new Promise(resolve => setTimeout(resolve, milSecond));
    }
    async _delayProgram() {
        while (true) {
            await this._sleepMS(this.delayTime);
            if (this.running == 3) {
                throw new Error("初期化しました。");
            }
            if (this.running == 2) {
                continue;
            }
            else {
                break;
            }
        }
    }
    _drawLine(fromX, fromY, toX, toY) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    }
    _clearCanvas() {
        this.context.clearRect(0, 0, this.cvWidth, this.cvHeight);
    }
    async _forward(distance) {
        const SIGN = distance > 0 ? 1 : -1;
        const TIMES = distance * SIGN / DELTA_XY;
        const START_X = this.centerX;
        const START_Y = this.centerY;
        const COS = Math.cos(this.directionAngle / 180 * Math.PI);
        const SIN = Math.sin(this.directionAngle / 180 * Math.PI);
        if (this.delayTime > 0) {
            for (let i = 0; i < TIMES; i++) {
                this.centerX += DELTA_XY * COS * SIGN;
                this.centerY -= DELTA_XY * SIN * SIGN;
                this._redrawObjects();
                if (this.penEnabled) {
                    this._drawLine(START_X, START_Y, this.centerX, this.centerY);
                }
                if (this.turtleVisible) {
                    this._drawTurtle();
                }
                await this._delayProgram();
            }
        }
        this.centerX = START_X + distance * COS;
        this.centerY = START_Y - distance * SIN;
        if (this.penEnabled) {
            this.registeredFigures.push(["line", [START_X, START_Y, this.centerX, this.centerY]]);
        }
        this._redrawObjects();
    }
    async _backward(startX, startY, distance) {
        const SIGN = distance > 0 ? 1 : -1;
        const TIMES = distance * SIGN / DELTA_XY;
        const COS = Math.cos(this.directionAngle / 180 * Math.PI);
        const SIN = Math.sin(this.directionAngle / 180 * Math.PI);
        if (this.delayTime > 0) {
            for (let i = 0; i < TIMES; i++) {
                this.centerX += DELTA_XY * COS * SIGN;
                this.centerY -= DELTA_XY * SIN * SIGN;
                this._redrawObjects();
                if (this.penEnabled) {
                    this._drawLine(startX, startY, this.centerX, this.centerY);
                }
                if (this.turtleVisible) {
                    this._drawTurtle();
                }
                await this._delayProgram();
            }
        }
        this.centerX = startX;
        this.centerY = startY;
        this._redrawObjects();
    }
    async forward(distance) {
        this.registeredCommands.push(["backward", this.registeredFigures.length, [this.centerX, this.centerY, -distance]]);
        await this._forward(distance);
    }
    async backward(distance) {
        this.registeredCommands.push(["backward", this.registeredFigures.length, [this.centerX, this.centerY, distance]]);
        await this._forward(-distance);
    }
    async _right(angle) {
        const SIGN = angle > 0 ? 1 : -1;
        const TIMES = angle * SIGN / DELTA_ANGLE;
        const START_ANGLE = this.directionAngle;
        if (this.delayTime > 0) {
            for (let i = 0; i < TIMES; i++) {
                this.directionAngle -= DELTA_ANGLE * SIGN;
                this._redrawObjects();
                await this._delayProgram();
            }
        }
        this.directionAngle = START_ANGLE - angle;
        this._redrawObjects();
    }
    async right(angle) {
        await this._right(angle);
        this.registeredCommands.push(["right", this.registeredFigures.length, [-angle]]);
    }
    async left(angle) {
        await this._right(-angle);
        this.registeredCommands.push(["right", this.registeredFigures.length, [angle]]);
    }
    async _goto(x, y) {
        const NEW_X = x + this.cvWidth / 2;
        const NEW_Y = -y + this.cvHeight / 2;
        const DELTA_X = NEW_X - this.centerX;
        const DELTA_Y = NEW_Y - this.centerY;
        const ANGLE = -(Math.atan2(DELTA_Y, DELTA_X) / Math.PI) * 180;
        const DISTANCE = Math.sqrt(Math.pow(DELTA_X, 2) + Math.pow(DELTA_Y, 2));
        const TIMES = DISTANCE / DELTA_XY;
        const START_X = this.centerX;
        const START_Y = this.centerY;
        const COS = Math.cos(ANGLE / 180 * Math.PI);
        const SIN = Math.sin(ANGLE / 180 * Math.PI);
        if (this.delayTime > 0) {
            for (let i = 0; i < TIMES; i++) {
                this.centerX += DELTA_XY * COS;
                this.centerY -= DELTA_XY * SIN;
                this._redrawObjects();
                if (this.penEnabled) {
                    this._drawLine(START_X, START_Y, this.centerX, this.centerY);
                }
                if (this.turtleVisible) {
                    this._drawTurtle();
                }
                await this._delayProgram();
            }
        }
        this.centerX = START_X + DISTANCE * COS;
        this.centerY = START_Y - DISTANCE * SIN;
        if (this.penEnabled) {
            this.registeredFigures.push(["line", [START_X, START_Y, this.centerX, this.centerY]]);
        }
        this._redrawObjects();
        return [DISTANCE, ANGLE];
    }
    async _backTo(x, y, distance, angle1, angle2) {
        await this._setheading(angle1);
        await this._backward(x, y, distance);
        await this._setheading(angle2);
        this._redrawObjects();
    }
    async goto(x, y) {
        let startX = this.centerX;
        let startY = this.centerY;
        let angle2 = this.directionAngle;
        let data = await this._goto(x, y);
        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
    }
    async home() {
        let startX = this.centerX;
        let startY = this.centerY;
        let angle2 = this.directionAngle;
        let data = await this._goto(0, 0);
        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
    }
    async setx(x) {
        let y = -this.centerY + this.cvHeight / 2;
        let startX = this.centerX;
        let startY = this.centerY;
        let angle2 = this.directionAngle;
        let data = await this._goto(x, y);
        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
    }
    async sety(y) {
        let x = this.centerX - this.cvWidth / 2;
        let startX = this.centerX;
        let startY = this.centerY;
        let angle2 = this.directionAngle;
        let data = await this._goto(x, y);
        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
    }
    _angleFitRange(angle) {
        angle = angle % 360;
        if ((angle <= 180) && (angle >= -180)) {
            return angle;
        }
        else if ((angle - 360 <= 180) && (angle - 360 >= -180)) {
            return angle - 360;
        }
        else {
            return angle + 360;
        }
    }
    async _setheading(to_angle) {
        const ANGLE = this._angleFitRange(to_angle - this.directionAngle);
        await this._right(-ANGLE);
        this.directionAngle = to_angle;
        this._redrawObjects();
        return ANGLE;
    }
    async setheading(to_angle) {
        let angle = await this._setheading(to_angle);
        this.registeredCommands.push(["right", this.registeredFigures.length, [angle]]);
    }
    pensize(width) {
        this.registeredCommands.push(["pensize", this.registeredFigures.length, [width]]);
        this.registeredFigures.push(["pensize", width]);
    }
    _convertRGB(red, green, blue) {
        let rgb = "#";
        rgb += ("00" + red.toString(16)).slice(-2);
        rgb += ("00" + green.toString(16)).slice(-2);
        rgb += ("00" + blue.toString(16)).slice(-2);
        return rgb.toUpperCase();
    }
    _convertColor(...args) {
        let color;
        if ((typeof (args[0]) == "string") && (args.length == 1)) {
            color = args[0];
        }
        else if (args.length == 1) {
            color = this._convertRGB(args[0][0], args[0][1], args[0][2]);
        }
        else {
            color = this._convertRGB(args[0], args[1], args[2]);
        }
        return color;
    }
    pencolor(...args) {
        let color = this._convertColor(...args);
        this.registeredCommands.push(["pencolor", this.registeredFigures.length, [color]]);
        this.registeredFigures.push(["pencolor", color]);
        this._redrawObjects();
    }
    fillcolor(...args) {
        let color = this._convertColor(...args);
        this.registeredCommands.push(["fillcolor", this.registeredFigures.length, [color]]);
        this.registeredFigures.push(["fillcolor", color]);
        this._redrawObjects();
    }
    color(...args) {
        if (args.length == 1 || args.length == 3) {
            let color = this._convertColor(...args);
            this.registeredCommands.push(["color", this.registeredFigures.length, [color, color]]);
            this.registeredFigures.push(["pencolor", color]);
            this.registeredFigures.push(["fillcolor", color]);
        }
        if (args.length == 2) {
            let penColor = this._convertColor(args[0]);
            let fillColor = this._convertColor(args[1]);
            this.registeredCommands.push(["color", this.registeredFigures.length, [penColor, fillColor]]);
            this.registeredFigures.push(["pencolor", penColor]);
            this.registeredFigures.push(["fillcolor", fillColor]);
        }
        this._redrawObjects();
    }
    bgcolor(...args) {
        this.registeredCommands.push(["bgcolor", this.registeredFigures.length, [this.bgColor]]);
        this.bgColor = this._convertColor(...args);
        this.canvas.style.backgroundColor = this.bgColor;
        this._redrawObjects();
    }
    penup() {
        this.registeredCommands.push(["pendown", this.registeredFigures.length, [this.penEnabled]]);
        this.penEnabled = false;
    }
    pendown() {
        this.registeredCommands.push(["pendown", this.registeredFigures.length, [this.penEnabled]]);
        this.penEnabled = true;
    }
    speed(speed) {
        this.registeredCommands.push(["speed", this.registeredFigures.length, [this.delayTime]]);
        this.delayTime = SPEED_TABLE[speed];
    }
    showturtle() {
        this.registeredCommands.push(["showturtle", this.registeredFigures.length, [this.turtleVisible]]);
        this.turtleVisible = true;
        this._redrawObjects();
    }
    hideturtle() {
        this.registeredCommands.push(["showturtle", this.registeredFigures.length, [this.turtleVisible]]);
        this.turtleVisible = false;
        this._redrawObjects();
    }
    _drawTurtle(centerX = NaN, centerY = NaN, directionAngle = NaN, turtleExpand = NaN) {
        if (isNaN(centerX)) {
            centerX = this.centerX;
        }
        if (isNaN(centerY)) {
            centerY = this.centerY;
        }
        if (isNaN(directionAngle)) {
            directionAngle = this.directionAngle;
        }
        if (isNaN(turtleExpand)) {
            turtleExpand = this.turtleExpand;
        }
        const RADIAN = (directionAngle - 90) / 180 * Math.PI;
        const COS = Math.cos(RADIAN);
        const SIN = Math.sin(RADIAN);
        this.context.beginPath();
        this.context.lineWidth = this.turtleExpand;
        SHAPE.forEach(element => this.context.lineTo(centerX + (element[0] * COS - element[1] * SIN) * turtleExpand, centerY - (element[0] * SIN + element[1] * COS) * turtleExpand));
        this.context.fill();
        this.context.stroke();
        this.context.lineWidth = this.penSize;
    }
    turtlesize(stretch) {
        this.registeredCommands.push(["turtlesize", this.registeredFigures.length, [this.turtleSize]]);
        this.registeredFigures.push(["turtlesize", stretch]);
        this._redrawObjects();
    }
    stamp() {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this.registeredFigures.push(["stamp", [
                this.centerX, this.centerY, this.directionAngle, this.turtleExpand
            ]]);
        this._redrawObjects();
    }
    dot(size) {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this.registeredFigures.push(["dot", [this.centerX, this.centerY, size]]);
        this._redrawObjects();
    }
    _createDot(centerX, centerY, size) {
        this.context.fillStyle = this.penColor;
        this.context.beginPath();
        this.context.arc(centerX, centerY, size / 2, 0, 360 * Math.PI, false);
        this.context.fill();
        this.context.fillStyle = this.fillColor;
    }
    async circle(radius, extent = 360) {
        this.registeredCommands.push(["circle", this.registeredFigures.length, [radius, extent, this.directionAngle]]);
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
        if (this.delayTime > 0 && radius != 0) {
            for (let i = 0; i < TIMES; i++) {
                let end = START + (END - START) / TIMES * i;
                this.centerX = CENTER_X + radius * Math.cos(end) * SIGN;
                this.centerY = CENTER_Y + radius * Math.sin(end) * SIGN;
                this.directionAngle = 90 * SIGN - end / Math.PI * 180;
                this._redrawObjects();
                if (this.penEnabled) {
                    this.context.beginPath();
                    this.context.arc(CENTER_X, CENTER_Y, radius * SIGN, START, end, radius > 0 ? true : false);
                    this.context.stroke();
                }
                if (this.turtleVisible) {
                    this._drawTurtle();
                }
                await this._delayProgram();
            }
        }
        this.centerX = CENTER_X + radius * Math.cos(END) * SIGN;
        this.centerY = CENTER_Y + radius * Math.sin(END) * SIGN;
        this.directionAngle = 90 * SIGN - END / Math.PI * 180;
        if (this.penEnabled) {
            this.registeredFigures.push(["circle", [radius, CENTER_X, CENTER_Y, START, END, SIGN]]);
        }
        this._redrawObjects();
    }
    async _backCircle(radius, extent, angle) {
        const START_X = this.centerX;
        const START_Y = this.centerY;
        const START_ANGLE = this.directionAngle;
        const SIGN = radius > 0 ? 1 : -1;
        const RADIAN = (START_ANGLE + 90 * SIGN) / 180 * Math.PI;
        const CENTER_X = START_X + radius * Math.cos(RADIAN) * SIGN;
        const CENTER_Y = START_Y - radius * Math.sin(RADIAN) * SIGN;
        const TIMES = (radius * extent / 180 * Math.PI * SIGN) / DELTA_CIRCLE;
        const START = (90 * SIGN - START_ANGLE) / 180 * Math.PI;
        const END = (90 * SIGN - angle) / 180 * Math.PI;
        if (this.delayTime > 0 && radius != 0) {
            for (let i = 0; i < TIMES; i++) {
                let end = START + (END - START) / TIMES * i;
                this.centerX = CENTER_X + radius * Math.cos(end) * SIGN;
                this.centerY = CENTER_Y + radius * Math.sin(end) * SIGN;
                this.directionAngle = 90 * SIGN - end / Math.PI * 180;
                this._redrawObjects();
                if (this.penEnabled) {
                    this.context.beginPath();
                    this.context.arc(CENTER_X, CENTER_Y, radius * SIGN, END, end, radius > 0 ? true : false);
                    this.context.stroke();
                }
                if (this.turtleVisible) {
                    this._drawTurtle();
                }
                await this._delayProgram();
            }
        }
        this.centerX = CENTER_X + radius * Math.cos(END) * SIGN;
        this.centerY = CENTER_Y + radius * Math.sin(END) * SIGN;
        this.directionAngle = 90 * SIGN - END / Math.PI * 180;
        this._redrawObjects();
    }
    _createCircle(radius, centerX, centerY, start, end, sign) {
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius * sign, start, end, radius > 0 ? true : false);
        this.context.stroke();
    }
    begin_fill() {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this.beginFillIndex = this.registeredFigures.length;
        this.registeredFigures.push(["begin_fill", [this.registeredFigures.length + 1, NaN, NaN]]);
        this._redrawObjects();
    }
    _beginFill(beginIndex, endIndex, fillStyle) {
        if (isNaN(endIndex)) {
            return;
        }
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        for (let i = beginIndex; i < endIndex; i++) {
            let figure = this.registeredFigures[i];
            let args = figure[1];
            if (figure[0] == "line") {
                this._fillLine(args[0], args[1], args[2], args[3]);
            }
            else if (figure[0] == "circle") {
                this._fillCircle(args[0], args[1], args[2], args[3], args[4], args[5]);
            }
        }
        this.context.closePath();
        this.context.fill("evenodd");
    }
    end_fill() {
        this.registeredCommands.push(["end_fill", this.registeredFigures.length, [this.beginFillIndex]]);
        if (isNaN(this.beginFillIndex)) {
            return;
        }
        this.registeredFigures[this.beginFillIndex][1][1] = this.registeredFigures.length;
        this.registeredFigures[this.beginFillIndex][1][2] = this.fillColor;
        this.beginFillIndex = NaN;
        this._redrawObjects();
    }
    _fillLine(fromX, fromY, toX, toY) {
        this.context.lineTo(toX, toY);
    }
    _fillCircle(radius, centerX, centerY, start, end, sign) {
        this.context.arc(centerX, centerY, radius * sign, start, end, radius > 0 ? true : false);
    }
    position() {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        return [this.centerX, this.centerY];
    }
    async undo() {
        if (this.registeredCommands.length <= 0) {
            return;
        }
        let command = this.registeredCommands[this.registeredCommands.length - 1];
        this.registeredCommands.pop();
        this.registeredFigures.splice(command[1]);
        this._redrawObjects();
        let args = command[2];
        if (command[0] == "sleep") {
            await this._sleep(args[0]);
        }
        else if (command[0] == "backward") {
            await this._backward(args[0], args[1], args[2]);
        }
        else if (command[0] == "right") {
            await this._right(args[0]);
        }
        else if (command[0] == "back_to") {
            await this._backTo(args[0], args[1], args[2], args[3], args[4]);
        }
        else if (command[0] == "circle") {
            await this._backCircle(args[0], args[1], args[2]);
        }
        else if (command[0] == "pendown") {
            this.penEnabled = args[0];
        }
        else if (command[0] == "speed") {
            this.delayTime = args[0];
        }
        else if (command[0] == "showturtle") {
            this.turtleVisible = args[0];
        }
        else if (command[0] == "end_fill") {
            this.registeredFigures[args[0]][1][1] = null;
            this.registeredFigures[args[0]][1][2] = null;
            this.beginFillIndex = args[0];
        }
        else if (command[0] == "bgcolor") {
            this.bgColor = args[0];
            this.canvas.style.backgroundColor = this.bgColor;
        }
        else if (command[0] == "pencolor") {
            this.penColor = args[0];
            this.context.strokeStyle = this.penColor;
        }
        else if (command[0] == "fillcolor") {
            this.fillColor = args[0];
            this.context.fillStyle = this.fillColor;
        }
        else if (command[0] == "color") {
            this.penColor = args[0];
            this.context.strokeStyle = this.penColor;
            this.fillColor = args[1];
            this.context.fillStyle = this.fillColor;
        }
        else if (command[0] == "pensize") {
            this.penSize = args[0];
            this.context.lineWidth = this.penSize;
        }
        else if (command[0] == "turtlesize") {
            this.turtleExpand = args[0];
        }
    }
    _redrawObjects(turtle = true) {
        this._clearCanvas();
        for (let i = 0; i < this.registeredFigures.length; i++) {
            let figure = this.registeredFigures[i];
            let args = figure[1];
            if (figure[0] == "line") {
                this._drawLine(args[0], args[1], args[2], args[3]);
            }
            else if (figure[0] == "pencolor") {
                this.penColor = args;
                this.context.strokeStyle = args;
            }
            else if (figure[0] == "fillcolor") {
                this.fillColor = args;
                this.context.fillStyle = args;
            }
            else if (figure[0] == "stamp") {
                this._drawTurtle(args[0], args[1], args[2], args[3]);
            }
            else if (figure[0] == "turtlesize") {
                this.turtleExpand = args;
            }
            else if (figure[0] == "dot") {
                this._createDot(args[0], args[1], args[2]);
            }
            else if (figure[0] == "circle") {
                this._createCircle(args[0], args[1], args[2], args[3], args[4], args[5]);
            }
            else if (figure[0] == "pensize") {
                this.penSize = args;
                this.context.lineWidth = args;
            }
            else if (figure[0] == "begin_fill") {
                this._beginFill(args[0], args[1], args[2]);
            }
        }
        if (this.turtleVisible && turtle) {
            this._drawTurtle();
        }
    }
}
