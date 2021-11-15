import {
  makeCanvas,
  rectangle,
  stage,
  render,
  circle,
  line,
  sprite,
} from "../lib/importer.js";

import { contain } from "../lib/utils.js";

import { assets } from "../lib/assets.js";

assets
  .load([
    "../images/people.svg",
    "../images/face01.svg",
    "../images/speedboat.svg",
    "../images/logoscaleableredblack.svg",
    "../images/lcdmonitor.svg",
    "../images/tourlitislighthouse06-raster.svg",
  ])
  .then(() => setup());

// listen for a change in window size
window.addEventListener("resize", resizeCanvas, false);

// create the canvas
let canvas = makeCanvas(
  window.innerWidth - 24,
  window.innerHeight - 24,
  "2px solid black",
  "white"
);

// vars shared across functions
let arse, c1, l1, l1YPos, peopleSVG, face, speedboat, logo, lcd, lighthouse;

// function to resize the canvas called by event listener
function resizeCanvas() {
  // resize the canvas
  canvas.width = window.innerWidth - 24;
  canvas.height = window.innerHeight - 24;

  // & resize the stage sprite
  stage.width = canvas.width;
  stage.height = canvas.height;
}

// when the canvas is resized, everything is wiped and
// the canvas is cleared so everything must be redrawn
// we could do this in the aniLoop, but it may help keep
// the clutter down by putting it in here???

//* ****** Function to resize & reposition on window resize ****** *\\
function redraw() {
  // the bouncing square's size
  arse.width = stage.halfHeight;
  arse.height = stage.halfHeight;

  // reset the square's position on the Y axis
  // so it stays central to the stage height
  arse.y = stage.halfHeight - arse.halfHeight;

  // resize the circle
  c1.diameter = arse.halfHeight;

  // reposition the line that the arse runs along
  l1.y = stage.halfHeight + arse.halfHeight + arse.lineWidth / 2;
  // set the end of the line to be the stage width
  l1.bx = stage.width;

  // resize the svg
  // peopleSVG.scaleX = 0.25;
  peopleSVG.width = arse.width;
  // put the image in the center of the arse
  arse.putCenter(peopleSVG);

  // face.height = stage.width * 0.25;
  // c1.putCenter(face);

  // speedboat
  speedboat.width = stage.height / 2;
  l1.putCenter(speedboat, stage.halfWidth);

  // logo
  logo.height = stage.height;
  stage.putCenter(logo);

  // lcd monitor
  lcd.height = stage.height / 4;
  logo.putCenter(lcd, 0, logo.halfHeight * 0.75);

  // Tourlitis Light House - Greece
  lighthouse.height = stage.height;
}

// setup();
function setup() {
  stage.width = canvas.width;
  stage.height = canvas.height;

  // a square to bounce off the sides of the stage
  arse = rectangle(stage.halfHeight, stage.halfHeight, "lightblue", "black", 8);

  // position the arse at the canvas center
  stage.putCenter(arse);

  // define the velocity vectors of the arse
  arse.vx = 1;
  arse.vy = 1;

  // draw a circle half the size of the arse
  c1 = circle(arse.halfHeight);
  // define the velocity vectors
  c1.vx = Math.floor(Math.random() * 9 + 1);
  c1.vy = Math.floor(Math.random() * 9 + 1);

  console.log(`c1.vx ${c1.vx} c2.vy: ${c1.vy}`);

  // a line!
  // OK! It's a line that uses a gradient as its strokeStyle!
  let ctx = canvas.getContext("2d");
  let linGrad = ctx.createLinearGradient(0, 0, 0, 10);

  linGrad.addColorStop(0, "black");
  linGrad.addColorStop(0.025, "white");
  linGrad.addColorStop(1, "black");
  // NB: the line's y position is set in the redraw() function
  l1 = line(linGrad, 10, 0, 5, stage.width, 5);

  //* ****** Images ****** *\\
  // all images have been preloaded with the `assets.load` method
  // which then calls this `setup()` function

  peopleSVG = sprite(assets["../images/people.svg"]);
  // face = sprite(assets["../images/face01.svg"]);
  // peopleSVG.width = arse.height;
  //NB: peopleSVG is positioned & scaled in `redraw()`

  //* ****** Speedboat ****** *\\
  speedboat = sprite(assets["../images/speedboat.svg"]);

  //* ****** logo-1 A ****** *\\

  logo = sprite(assets["../images/logoscaleableredblack.svg"]);

  //* ****** ;cs monitor ****** *\\
  lcd = sprite(assets["../images/lcdmonitor.svg"]);

  //* ****** lighthouse ****** *\\
  lighthouse = sprite(assets["../images/tourlitislighthouse06-raster.svg"]);

  aniLoop();
  // render(canvas);
}

function aniLoop() {
  requestAnimationFrame(aniLoop);

  // redraw, resize, & reposition everything to the new canvas size
  redraw();

  // bounce the arse off the stage edges
  let arseContain = contain(arse, stage, true);

  // move the arse right by incrementally
  // adding the velocity vector
  arse.x += arse.vx;

  // The code below has been replaced by the `contain()` function
  // bounce the arse off the left
  // if (arse.x <= 0) {
  //   arse.x = 0;
  //   arse.vx *= -1;
  // }

  // bounce the arse off the right
  // if (arse.x + arse.width >= stage.width) {
  //   arse.x = stage.width - arse.width;
  //   arse.vx *= -1;
  // }

  // define the boundries that contain the bouncing circle
  let c1Bounds = {
    x: 0,
    y: 0,
    width: stage.width,
    height: l1.y,
  };

  // bounce the circle off the stage edges & the line
  let c1Contain = contain(c1, c1Bounds, true);
  // move the circle
  c1.x += c1.vx;
  c1.y += c1.vy;
  // console.log(c1Contain.collision);

  render(canvas);
}

/* ****** Obsolete ****** */

// Note: This function works as expected and
// the drawing is scaled with the canvas
// draw();
function draw() {
  // calc the center of the canvas
  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;
  console.log("window width / height", window.innerWidth, window.innerHeight);

  let ctx = canvas.getContext("2d");

  // define the size of the square
  let size = window.innerHeight * 0.75;
  let halfSize = size / 2;
  console.log(" size / halfsize", size, halfSize);

  // make a square
  const greySquare =
    ((ctx.fillStyle = "grey"),
    (ctx.strokeStyle = "black"),
    (ctx.lineWidth = 1),
    ctx.rect(centerX - halfSize, centerY - halfSize, size, size),
    ctx.fill(),
    ctx.stroke());
}
