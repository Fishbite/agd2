// Variables
let start, end, timed, move;

// **** Document Elements **** \\
// canvas
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.style.backgroundColor = "#555";

//button
btn = document.getElementById("btn");

// test result targets
btnTest = document.getElementById("btnTest");
canvasTest = document.getElementById("canvasTest");

// **** Listeners **** \\
btn.addEventListener("touchstart", btnStartHandler, { passive: false });
btn.addEventListener("touchend", btnEndHndler, { passive: false });

canvas.addEventListener("touchstart", canvasStartHandler, { passive: false });
canvas.addEventListener("touchend", canvasEndHndler, { passive: false });

// **** Event Handlers **** \\
function btnStartHandler(e) {
  e.preventDefault();

  // add a visual cue to the event
  btn.style.backgroundColor = "goldenrod";

  // store the start time
  start = Date.now();

  // write the test results
  console.log(`Button Test: ${e.type} fired at ${start}`);
  btnTest.innerText += ` ${e.type} fired at ${start}\n`;
}

function btnEndHndler(e) {
  e.preventDefault();

  // reset the button's color
  btn.style.backgroundColor = "lightgrey";

  //store the end time
  end = Date.now();

  // calculate the duration
  timed = end - start;

  // write the test r
  console.log(`Button Test: ${e.type} fired after ${timed}ms`);
  btnTest.innerText += ` ${e.type} fired after ${timed}ms\n`;
}

function canvasStartHandler(e) {
  e.preventDefault();

  //
  move = true;

  // add a visual cue to the event
  canvas.style.backgroundColor = "goldenrod";

  start = Date.now(); // log the time touchstart started
  console.log(`Canvas Test: ${e.type} fired at ${start}`);

  // write the results to the web page
  canvasTest.innerText += ` ${e.type} fired at ${start}\n`;
}

function canvasEndHndler(e) {
  e.preventDefault();
  move = false; // animation var
  canvas.style.backgroundColor = "#555";

  end = Date.now();
  timed = end - start; // calc the duration of `touchstart`
  // write to the web page and console
  console.log(`Canvas Test: ${e.type} fired after ${timed}ms`);
  canvasTest.innerText += ` ${e.type} fired after ${timed}ms\n`;
}

// **** Canvas Animation **** \\
// some vars to help us move something on canvas
let x = 0,
  y = 0,
  vx = 1,
  acceleration = 0.25;

// loop so that we can animate something on the canvas
loop();
function loop() {
  requestAnimationFrame(loop);
  canvas.width = document.body.clientWidth;
  // draw a vertical stripe on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lightblue";
  ctx.beginPath();
  ctx.rect(x, y, 16, canvas.height);
  ctx.fill();

  // move and accelerate the stripe while the canvas is being touched
  if (!move) {
    vx = 0;
  } else if (move) {
    if (x <= canvas.width + 16) {
      vx += acceleration;
      // console.log(vx);
      x += vx;
    } else {
      vx = 0;
      x = 0;
    }
  }
}
