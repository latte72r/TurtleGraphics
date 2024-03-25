// SpiralWeb
let colors = ['red', 'skyblue', 'green', 'purple', 'orange', 'blue'];
turtle.speed(10);
for (let x = 0; x < 200; x++) {
    turtle.pencolor(colors[x%6]);
    turtle.pensize(x / 100 + 1);
    await turtle.forward(x);
    await turtle.left(59);
}