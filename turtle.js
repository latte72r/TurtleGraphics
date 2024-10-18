// (c) 2022-2024 Ryo Fujinami.
// ver 0.7.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var SHAPE = [
    [0, 14], [-2, 12], [-1, 8], [-4, 5], [-7, 7], [-9, 6],
    [-6, 3], [-7, -1], [-5, -5], [-8, -8], [-6, -10], [-4, -7],
    [0, -9], [4, -7], [6, -10], [8, -8], [5, -5], [7, -1],
    [6, 3], [9, 6], [7, 7], [4, 5], [1, 8], [2, 12], [0, 14]
];
var SPEED_TABLE = {
    0: 0, 1: 40, 2: 36, 3: 30, 4: 22, 5: 16, 6: 12, 7: 8, 8: 6, 9: 4, 10: 2
};
var DELTA_XY = 4;
var DELTA_ANGLE = 4;
var DELTA_CIRCLE = 4;
var editor;
var Turtle = /** @class */ (function () {
    function Turtle(width, height, canvasId) {
        this.cvWidth = width;
        this.cvHeight = height;
        this.canvas = document.getElementById(canvasId);
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
    Turtle.prototype.reset = function () {
        this.registeredFigures = [];
        this.registeredCommands = [];
        this.directionAngle = 0;
        this.centerX = this.cvWidth / 2;
        this.centerY = this.cvHeight / 2;
        this.beginFillIndex = NaN;
        this.penColor = "#000000";
        this.fillColor = "#000000";
        this.penSize = 1;
        this.turtleSize = 1;
        this.penEnabled = true;
        this.turtleVisible = true;
        this.delayTime = SPEED_TABLE[6];
        this.registeredFigures.push(["pencolor", this.penColor]);
        this.registeredFigures.push(["fillcolor", this.fillColor]);
        this.registeredFigures.push(["pensize", this.penSize]);
        this.registeredFigures.push(["turtlesize", this.turtleSize]);
        this._redrawObjects();
    };
    Turtle.prototype.sleep = function (secs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.registeredCommands.push(["sleep", this.registeredFigures.length, [secs]]);
                        return [4 /*yield*/, this._sleep(secs)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._sleep = function (secs) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < secs * 1000 / this.delayTime)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._delayProgram()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._sleepMS = function (milSecond) {
        return new Promise(function (resolve) { return setTimeout(resolve, milSecond); });
    };
    Turtle.prototype._delayProgram = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._sleepMS(this.delayTime)];
                    case 1:
                        _a.sent();
                        if (running == 1) {
                            return [3 /*break*/, 2];
                        }
                        else if (running == 3) {
                            throw new Error("初期化しました。");
                        }
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._drawLine = function (fromX, fromY, toX, toY) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    };
    Turtle.prototype._clearCanvas = function () {
        this.context.clearRect(0, 0, this.cvWidth, this.cvHeight);
    };
    Turtle.prototype._forward = function (distance) {
        return __awaiter(this, void 0, void 0, function () {
            var SIGN, TIMES, START_X, START_Y, COS, SIN, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SIGN = distance > 0 ? 1 : -1;
                        TIMES = distance * SIGN / DELTA_XY;
                        START_X = this.centerX;
                        START_Y = this.centerY;
                        COS = Math.cos(this.directionAngle / 180 * Math.PI);
                        SIN = Math.sin(this.directionAngle / 180 * Math.PI);
                        if (!(this.delayTime > 0)) return [3 /*break*/, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < TIMES)) return [3 /*break*/, 4];
                        this.centerX += DELTA_XY * COS * SIGN;
                        this.centerY -= DELTA_XY * SIN * SIGN;
                        this._redrawObjects();
                        if (this.penEnabled) {
                            this._drawLine(START_X, START_Y, this.centerX, this.centerY);
                        }
                        if (this.turtleVisible) {
                            this._drawTurtle();
                        }
                        return [4 /*yield*/, this._delayProgram()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.centerX = START_X + distance * COS;
                        this.centerY = START_Y - distance * SIN;
                        if (this.penEnabled) {
                            this.registeredFigures.push(["line", [START_X, START_Y, this.centerX, this.centerY]]);
                        }
                        this._redrawObjects();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._backward = function (startX, startY, distance) {
        return __awaiter(this, void 0, void 0, function () {
            var SIGN, TIMES, COS, SIN, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SIGN = distance > 0 ? 1 : -1;
                        TIMES = distance * SIGN / DELTA_XY;
                        COS = Math.cos(this.directionAngle / 180 * Math.PI);
                        SIN = Math.sin(this.directionAngle / 180 * Math.PI);
                        if (!(this.delayTime > 0)) return [3 /*break*/, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < TIMES)) return [3 /*break*/, 4];
                        this.centerX += DELTA_XY * COS * SIGN;
                        this.centerY -= DELTA_XY * SIN * SIGN;
                        this._redrawObjects();
                        if (this.penEnabled) {
                            this._drawLine(startX, startY, this.centerX, this.centerY);
                        }
                        if (this.turtleVisible) {
                            this._drawTurtle();
                        }
                        return [4 /*yield*/, this._delayProgram()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.centerX = startX;
                        this.centerY = startY;
                        this._redrawObjects();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.forward = function (distance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.registeredCommands.push(["backward", this.registeredFigures.length, [this.centerX, this.centerY, -distance]]);
                        return [4 /*yield*/, this._forward(distance)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.backward = function (distance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.registeredCommands.push(["backward", this.registeredFigures.length, [this.centerX, this.centerY, distance]]);
                        return [4 /*yield*/, this._forward(-distance)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._right = function (angle) {
        return __awaiter(this, void 0, void 0, function () {
            var SIGN, TIMES, START_ANGLE, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SIGN = angle > 0 ? 1 : -1;
                        TIMES = angle * SIGN / DELTA_ANGLE;
                        START_ANGLE = this.directionAngle;
                        if (!(this.delayTime > 0)) return [3 /*break*/, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < TIMES)) return [3 /*break*/, 4];
                        this.directionAngle -= DELTA_ANGLE * SIGN;
                        this._redrawObjects();
                        return [4 /*yield*/, this._delayProgram()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.directionAngle = START_ANGLE - angle;
                        this._redrawObjects();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.right = function (angle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._right(angle)];
                    case 1:
                        _a.sent();
                        this.registeredCommands.push(["right", this.registeredFigures.length, [-angle]]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.left = function (angle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._right(-angle)];
                    case 1:
                        _a.sent();
                        this.registeredCommands.push(["right", this.registeredFigures.length, [angle]]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._goto = function (x, y) {
        return __awaiter(this, void 0, void 0, function () {
            var NEW_X, NEW_Y, DELTA_X, DELTA_Y, ANGLE, DISTANCE, TIMES, START_X, START_Y, COS, SIN, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        NEW_X = x + this.cvWidth / 2;
                        NEW_Y = -y + this.cvHeight / 2;
                        DELTA_X = NEW_X - this.centerX;
                        DELTA_Y = NEW_Y - this.centerY;
                        ANGLE = -(Math.atan2(DELTA_Y, DELTA_X) / Math.PI) * 180;
                        DISTANCE = Math.sqrt(Math.pow(DELTA_X, 2) + Math.pow(DELTA_Y, 2));
                        TIMES = DISTANCE / DELTA_XY;
                        START_X = this.centerX;
                        START_Y = this.centerY;
                        COS = Math.cos(ANGLE / 180 * Math.PI);
                        SIN = Math.sin(ANGLE / 180 * Math.PI);
                        if (!(this.delayTime > 0)) return [3 /*break*/, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < TIMES)) return [3 /*break*/, 4];
                        this.centerX += DELTA_XY * COS;
                        this.centerY -= DELTA_XY * SIN;
                        this._redrawObjects();
                        if (this.penEnabled) {
                            this._drawLine(START_X, START_Y, this.centerX, this.centerY);
                        }
                        if (this.turtleVisible) {
                            this._drawTurtle();
                        }
                        return [4 /*yield*/, this._delayProgram()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.centerX = START_X + DISTANCE * COS;
                        this.centerY = START_Y - DISTANCE * SIN;
                        if (this.penEnabled) {
                            this.registeredFigures.push(["line", [START_X, START_Y, this.centerX, this.centerY]]);
                        }
                        this._redrawObjects();
                        return [2 /*return*/, [DISTANCE, ANGLE]];
                }
            });
        });
    };
    Turtle.prototype._backTo = function (x, y, distance, angle1, angle2) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._setheading(angle1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._backward(x, y, distance)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._setheading(angle2)];
                    case 3:
                        _a.sent();
                        this._redrawObjects();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.goto = function (x, y) {
        return __awaiter(this, void 0, void 0, function () {
            var startX, startY, angle2, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startX = this.centerX;
                        startY = this.centerY;
                        angle2 = this.directionAngle;
                        return [4 /*yield*/, this._goto(x, y)];
                    case 1:
                        data = _a.sent();
                        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.home = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startX, startY, angle2, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startX = this.centerX;
                        startY = this.centerY;
                        angle2 = this.directionAngle;
                        return [4 /*yield*/, this._goto(0, 0)];
                    case 1:
                        data = _a.sent();
                        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.setx = function (x) {
        return __awaiter(this, void 0, void 0, function () {
            var y, startX, startY, angle2, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        y = -this.centerY + this.cvHeight / 2;
                        startX = this.centerX;
                        startY = this.centerY;
                        angle2 = this.directionAngle;
                        return [4 /*yield*/, this._goto(x, y)];
                    case 1:
                        data = _a.sent();
                        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.sety = function (y) {
        return __awaiter(this, void 0, void 0, function () {
            var x, startX, startY, angle2, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        x = this.centerX - this.cvWidth / 2;
                        startX = this.centerX;
                        startY = this.centerY;
                        angle2 = this.directionAngle;
                        return [4 /*yield*/, this._goto(x, y)];
                    case 1:
                        data = _a.sent();
                        this.registeredCommands.push(["back_to", this.registeredFigures.length - 1, [startX, startY, -data[0], data[1], angle2]]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._angleFitRange = function (angle) {
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
    };
    Turtle.prototype._setheading = function (to_angle) {
        return __awaiter(this, void 0, void 0, function () {
            var ANGLE;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ANGLE = this._angleFitRange(to_angle - this.directionAngle);
                        return [4 /*yield*/, this._right(-ANGLE)];
                    case 1:
                        _a.sent();
                        this.directionAngle = to_angle;
                        this._redrawObjects();
                        return [2 /*return*/, ANGLE];
                }
            });
        });
    };
    Turtle.prototype.setheading = function (to_angle) {
        return __awaiter(this, void 0, void 0, function () {
            var angle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._setheading(to_angle)];
                    case 1:
                        angle = _a.sent();
                        this.registeredCommands.push(["right", this.registeredFigures.length, [angle]]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.pensize = function (width) {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this.registeredFigures.push(["pensize", width]);
    };
    Turtle.prototype._convertRGB = function (red, green, blue) {
        var rgb = "#";
        rgb += ("00" + red.toString(16)).slice(-2);
        rgb += ("00" + green.toString(16)).slice(-2);
        rgb += ("00" + blue.toString(16)).slice(-2);
        return rgb.toUpperCase();
    };
    Turtle.prototype._pencolor = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var penColor;
        if ((typeof (args[0]) == "string") && (args.length == 1)) {
            penColor = args[0];
        }
        else if (args.length == 1) {
            penColor = this._convertRGB(args[0][0], args[0][1], args[0][2]);
        }
        else {
            penColor = this._convertRGB(args[0], args[1], args[2]);
        }
        this.registeredFigures.push(["pencolor", penColor]);
        this._redrawObjects();
    };
    Turtle.prototype._fillcolor = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var fillColor;
        if ((typeof (args[0]) == "string") && (args.length == 1)) {
            fillColor = args[0];
        }
        else if (args.length == 1) {
            fillColor = this._convertRGB(args[0][0], args[0][1], args[0][2]);
        }
        else {
            fillColor = this._convertRGB(args[0], args[1], args[2]);
        }
        this.registeredFigures.push(["fillcolor", fillColor]);
        this._redrawObjects();
    };
    Turtle.prototype.pencolor = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this._pencolor.apply(this, args);
    };
    Turtle.prototype.fillcolor = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this._fillcolor.apply(this, args);
    };
    Turtle.prototype.color = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        if (args.length == 1 || args.length == 3) {
            this._pencolor.apply(this, args);
            this._fillcolor.apply(this, args);
        }
        if (args.length == 2) {
            this._pencolor(args[0]);
            this._fillcolor(args[1]);
        }
    };
    Turtle.prototype.penup = function () {
        this.registeredCommands.push(["pendown", this.registeredFigures.length, [this.penEnabled]]);
        this.penEnabled = false;
    };
    Turtle.prototype.pendown = function () {
        this.registeredCommands.push(["pendown", this.registeredFigures.length, [this.penEnabled]]);
        this.penEnabled = true;
    };
    Turtle.prototype.speed = function (speed) {
        this.registeredCommands.push(["speed", this.registeredFigures.length, [this.delayTime]]);
        this.delayTime = SPEED_TABLE[speed];
    };
    Turtle.prototype.showturtle = function () {
        this.registeredCommands.push(["showturtle", this.registeredFigures.length, [this.turtleVisible]]);
        this.turtleVisible = true;
        this._redrawObjects();
    };
    Turtle.prototype.hideturtle = function () {
        this.registeredCommands.push(["showturtle", this.registeredFigures.length, [this.turtleVisible]]);
        this.turtleVisible = false;
        this._redrawObjects();
    };
    Turtle.prototype._drawTurtle = function (centerX, centerY, directionAngle, turtleExpand) {
        var _this = this;
        if (centerX === void 0) { centerX = NaN; }
        if (centerY === void 0) { centerY = NaN; }
        if (directionAngle === void 0) { directionAngle = NaN; }
        if (turtleExpand === void 0) { turtleExpand = NaN; }
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
        var RADIAN = (directionAngle - 90) / 180 * Math.PI;
        var COS = Math.cos(RADIAN);
        var SIN = Math.sin(RADIAN);
        this.context.beginPath();
        this.context.lineWidth = this.turtleExpand;
        SHAPE.forEach(function (element) { return _this.context.lineTo(centerX + (element[0] * COS - element[1] * SIN) * turtleExpand, centerY - (element[0] * SIN + element[1] * COS) * turtleExpand); });
        this.context.fill();
        this.context.stroke();
        this.context.lineWidth = this.penSize;
    };
    Turtle.prototype.turtlesize = function (stretch) {
        this.registeredCommands.push(["turtlesize", this.registeredFigures.length, [this.turtleSize]]);
        this.registeredFigures.push(["turtlesize", stretch]);
        this._redrawObjects();
    };
    Turtle.prototype.stamp = function () {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this.registeredFigures.push(["stamp", [
                this.centerX, this.centerY, this.directionAngle, this.turtleExpand
            ]]);
        this._redrawObjects();
    };
    Turtle.prototype.dot = function (size) {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this.registeredFigures.push(["dot", [this.centerX, this.centerY, size]]);
        this._redrawObjects();
    };
    Turtle.prototype._createDot = function (centerX, centerY, size) {
        this.context.beginPath();
        this.context.arc(centerX, centerY, size / 2, 0, 360 * Math.PI, false);
        this.context.fill();
    };
    Turtle.prototype.circle = function (radius_1) {
        return __awaiter(this, arguments, void 0, function (radius, extent) {
            var START_X, START_Y, START_ANGLE, SIGN, RADIAN, CENTER_X, CENTER_Y, TIMES, START, END, i, end;
            if (extent === void 0) { extent = 360; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.registeredCommands.push(["circle", this.registeredFigures.length, [radius, extent, this.directionAngle]]);
                        START_X = this.centerX;
                        START_Y = this.centerY;
                        START_ANGLE = this.directionAngle;
                        SIGN = radius > 0 ? 1 : -1;
                        RADIAN = (START_ANGLE + 90 * SIGN) / 180 * Math.PI;
                        CENTER_X = START_X + radius * Math.cos(RADIAN) * SIGN;
                        CENTER_Y = START_Y - radius * Math.sin(RADIAN) * SIGN;
                        TIMES = (radius * extent / 180 * Math.PI * SIGN) / DELTA_CIRCLE;
                        START = (90 * SIGN - START_ANGLE) / 180 * Math.PI;
                        END = ((90 - extent) * SIGN - START_ANGLE) / 180 * Math.PI;
                        if (!(this.delayTime > 0 && radius != 0)) return [3 /*break*/, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < TIMES)) return [3 /*break*/, 4];
                        end = START + (END - START) / TIMES * i;
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
                        return [4 /*yield*/, this._delayProgram()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.centerX = CENTER_X + radius * Math.cos(END) * SIGN;
                        this.centerY = CENTER_Y + radius * Math.sin(END) * SIGN;
                        this.directionAngle = 90 * SIGN - END / Math.PI * 180;
                        if (this.penEnabled) {
                            this.registeredFigures.push(["circle", [radius, CENTER_X, CENTER_Y, START, END, SIGN]]);
                        }
                        this._redrawObjects();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._backCircle = function (radius, extent, angle) {
        return __awaiter(this, void 0, void 0, function () {
            var START_X, START_Y, START_ANGLE, SIGN, RADIAN, CENTER_X, CENTER_Y, TIMES, START, END, i, end;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        START_X = this.centerX;
                        START_Y = this.centerY;
                        START_ANGLE = this.directionAngle;
                        SIGN = radius > 0 ? 1 : -1;
                        RADIAN = (START_ANGLE + 90 * SIGN) / 180 * Math.PI;
                        CENTER_X = START_X + radius * Math.cos(RADIAN) * SIGN;
                        CENTER_Y = START_Y - radius * Math.sin(RADIAN) * SIGN;
                        TIMES = (radius * extent / 180 * Math.PI * SIGN) / DELTA_CIRCLE;
                        START = (90 * SIGN - START_ANGLE) / 180 * Math.PI;
                        END = (90 * SIGN - angle) / 180 * Math.PI;
                        if (!(this.delayTime > 0 && radius != 0)) return [3 /*break*/, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < TIMES)) return [3 /*break*/, 4];
                        end = START + (END - START) / TIMES * i;
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
                        return [4 /*yield*/, this._delayProgram()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.centerX = CENTER_X + radius * Math.cos(END) * SIGN;
                        this.centerY = CENTER_Y + radius * Math.sin(END) * SIGN;
                        this.directionAngle = 90 * SIGN - END / Math.PI * 180;
                        this._redrawObjects();
                        return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._createCircle = function (radius, centerX, centerY, start, end, sign) {
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius * sign, start, end, radius > 0 ? true : false);
        this.context.stroke();
    };
    Turtle.prototype.begin_fill = function () {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        this.beginFillIndex = this.registeredFigures.length;
        this.registeredFigures.push(["begin_fill", [this.registeredFigures.length + 1, NaN, NaN]]);
        this._redrawObjects();
    };
    Turtle.prototype._beginFill = function (beginIndex, endIndex, fillStyle) {
        if (isNaN(endIndex)) {
            return;
        }
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        for (var i = beginIndex; i < endIndex; i++) {
            var figure = this.registeredFigures[i];
            var args = figure[1];
            if (figure[0] == "line") {
                this._fillLine(args[0], args[1], args[2], args[3]);
            }
            else if (figure[0] == "circle") {
                this._fillCircle(args[0], args[1], args[2], args[3], args[4], args[5]);
            }
        }
        this.context.closePath();
        this.context.fill("evenodd");
    };
    Turtle.prototype.end_fill = function () {
        this.registeredCommands.push(["end_fill", this.registeredFigures.length, [this.beginFillIndex]]);
        if (isNaN(this.beginFillIndex)) {
            return;
        }
        this.registeredFigures[this.beginFillIndex][1][1] = this.registeredFigures.length;
        this.registeredFigures[this.beginFillIndex][1][2] = this.fillColor;
        this.beginFillIndex = NaN;
        this._redrawObjects();
    };
    Turtle.prototype._fillLine = function (fromX, fromY, toX, toY) {
        this.context.lineTo(toX, toY);
    };
    Turtle.prototype._fillCircle = function (radius, centerX, centerY, start, end, sign) {
        this.context.arc(centerX, centerY, radius * sign, start, end, radius > 0 ? true : false);
    };
    Turtle.prototype.position = function () {
        this.registeredCommands.push(["none", this.registeredFigures.length, []]);
        return [this.centerX, this.centerY];
    };
    Turtle.prototype.undo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command, args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.registeredCommands.length <= 0) {
                            return [2 /*return*/];
                        }
                        command = this.registeredCommands[this.registeredCommands.length - 1];
                        this.registeredCommands.pop();
                        this.registeredFigures.splice(command[1]);
                        this._redrawObjects();
                        args = command[2];
                        if (!(command[0] == "sleep")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._sleep(args[0])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 2:
                        if (!(command[0] == "backward")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._backward(args[0], args[1], args[2])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 4:
                        if (!(command[0] == "right")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._right(args[0])];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 6:
                        if (!(command[0] == "back_to")) return [3 /*break*/, 8];
                        return [4 /*yield*/, this._backTo(args[0], args[1], args[2], args[3], args[4])];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 8:
                        if (!(command[0] == "circle")) return [3 /*break*/, 10];
                        return [4 /*yield*/, this._backCircle(args[0], args[1], args[2])];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        if (command[0] == "pendown") {
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
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype._redrawObjects = function (turtle) {
        if (turtle === void 0) { turtle = true; }
        this._clearCanvas();
        for (var i = 0; i < this.registeredFigures.length; i++) {
            var figure = this.registeredFigures[i];
            var args = figure[1];
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
    };
    return Turtle;
}());
var turtle;
var running = 0;
function runCode() {
    return __awaiter(this, void 0, void 0, function () {
        var CODE, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CODE = editor.getValue();
                    if (!((running == 1) || (running == 2))) return [3 /*break*/, 4];
                    result = window.confirm("プログラムを実行中です\n初期化しますか？");
                    if (!result) return [3 /*break*/, 3];
                    running = 3;
                    return [4 /*yield*/, turtle._sleepMS(turtle.delayTime * 4)];
                case 1:
                    _a.sent();
                    turtle.reset();
                    running = 1;
                    return [4 /*yield*/, eval("(async () => {try {" + CODE + "} catch(e) {alert(e.message)}})()")];
                case 2:
                    _a.sent();
                    running = 0;
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    turtle.reset();
                    running = 1;
                    return [4 /*yield*/, eval("(async () => {try {" + CODE + "} catch(e) {alert(e.message)}})()")];
                case 5:
                    _a.sent();
                    running = 0;
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function pauseResume() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (running == 0) {
                alert("プログラムが実行されていません");
            }
            else if (running == 1) {
                running = 2;
            }
            else if (running == 2) {
                running = 1;
            }
            return [2 /*return*/];
        });
    });
}
