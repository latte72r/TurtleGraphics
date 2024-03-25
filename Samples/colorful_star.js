// ColorfulStar
turtle.speed(10);
for (let i = 0; i < 30; i++) {
    r = 64 + i * 6;
    g = 32 + i * 4;
    b = 196 - i * 6;
    turtle.pencolor(r, g, b);
    await turtle.forward(100 + 10 * i);
    await turtle.right(144);
}
await turtle.sleep(1);
for (let i = 0; i < 120; i++) {
    await turtle.undo();
}