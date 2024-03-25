// TurtleStar
turtle.speed(10);
turtle.pencolor("red");
turtle.fillcolor("yellow");
turtle.begin_fill();
for (let i = 0; i < 36; i++) {
    await turtle.forward(200);
    await turtle.left(170);
}
turtle.end_fill();