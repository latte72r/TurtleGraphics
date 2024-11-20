
let turtle;
let editor;

function setupTurtle() {
    try {
        turtle = new Turtle(canvasWidth, canvasHeight, "canvas");
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    }
}

let ts = [
    'declare class Turtle {',
    '    reset(): void;',
    '    sleep(secs: number): Promise<void>;',
    '    forward(distance: number): Promise<void>;',
    '    backward(distance: number): Promise<void>;',
    '    right(angle: number): Promise<void>;',
    '    left(angle: number): Promise<void>;',
    '    goto(x: number, y: number): Promise<void>;',
    '    home(): Promise<void>;',
    '    setx(x: number): Promise<void>;',
    '    sety(y: number): Promise<void>;',
    '    setheading(to_angle: number): Promise<void>;',
    '    pensize(width: number): void;',
    '    pencolor(...args: any): void;',
    '    fillcolor(...args: any): void;',
    '    color(...args: any): void;',
    '    bgcolor(...args: any): void;',
    '    penup(): void;',
    '    pendown(): void;',
    '    speed(speed: number): void;',
    '    showturtle(): void;',
    '    hideturtle(): void;',
    '    turtlesize(stretch: number): void;',
    '    stamp(): void;',
    '    dot(size: number): void;',
    '    circle(radius: number, extent?: number): Promise<void>;',
    '    begin_fill(): void;',
    '    end_fill(): void; oid;',
    '    position(): number[];',
    '    undo(): Promise<void>;',
    '}',
    'declare let turtle: Turtle;'].join("\n");

function setupEditor() {
    require.config({ paths: { vs: "./monaco-editor/vs" } });
    require(["vs/editor/editor.main"], function () {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(ts, "turtle.d.ts");
        editor = monaco.editor.create(
            document.getElementById("editor"), {
            value: [
                "// Example",
                "turtle.color('red', 'yellow');",
                "turtle.begin_fill();",
                "for (let i = 0; i < 5; i++) {",
                "    await turtle.forward(100);",
                "    await turtle.right(144);",
                "}",
                "turtle.end_fill();"
            ].join("\n"),
            language: "javascript",
            scrollBeyondLastLine: false,
            fontSize: 16,
            minimap: { enabled: false },
            scrollbar: { alwaysConsumeMouseWheel: false }
        });
    });
}

function downloadAsFile() {
    const text = editor.getValue();
    const filename = "download.js";
    const blob = new Blob([text], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const elem_a = document.createElement("a");
    elem_a.href = url;
    elem_a.download = filename;
    document.body.appendChild(elem_a);
    elem_a.click();
    document.body.removeChild(elem_a);
    URL.revokeObjectURL(url);
}

function setupFile() {
    const fileInputElem = document.getElementById("fileInputElem");
    fileInputElem.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            editor.setValue(reader.result);
        };
        reader.readAsText(file);
    });
}

async function runCode() {
    const CODE = editor.getValue();
    if ((turtle.running == 1) || (turtle.running == 2)) {
        let result = window.confirm("プログラムを実行中です\n初期化しますか？");
        if (result) {
            turtle.running = 3;
            await turtle._sleepMS(turtle.delayTime * 4);
            turtle.reset();
            turtle.running = 1;
            await eval("(async () => {try {" + CODE + "} catch(e) {alert(e.message)}})()");
            turtle.running = 0;
        }
    } else {
        turtle.reset();
        turtle.running = 1;
        await eval("(async () => {try {" + CODE + "} catch(e) {alert(e.message)}})()");
        turtle.running = 0;
    }
}

async function pauseResume() {
    if (turtle.running == 0) {
        alert("プログラムが実行されていません");
    } else if (turtle.running == 1) {
        turtle.running = 2;
    } else if (turtle.running == 2) {
        turtle.running = 1;
    }
}
