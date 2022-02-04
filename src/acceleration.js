// A canvas element for the animation
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d"); // we draw on the context
canvas.style.backgroundColor = "#555";
canvas.height = 100;

// **** Canvas Animation **** \\
// some vars to help us move something on canvas
let x = 0,
  vx = 1, // velocity
  acceleration = 0.125; // acceleration

// A loop so that we can animate something on the canvas
loop();
function loop() {
  // loop the animation at 60fps
  requestAnimationFrame(loop);
  // fill the width of the page with the canvas
  canvas.width = document.body.clientWidth;

  // clear the canvas so we can redraw everyframe
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw a shape on the canvas
  ctx.fillStyle = "lightblue";
  ctx.beginPath();
  ctx.rect(x, 16, 16, canvas.height - 35);
  ctx.fill();

  // move and accelerate the shape
  // if the shape hasn't reached the end of the canvas
  if (x <= canvas.width + 16) {
    vx += acceleration; // add accelaration to the velocity
    x += vx; // move the shape with the new velocity value
  } else {
    // the shape reached the end of the canvas
    vx = 0; // reset the velocity
    x = 0; // repostion the shape at the begining of the canvas
  }
}
