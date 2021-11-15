// ****** Movement ****** \\
/*
  Exploring the use of rotation properties and angles:

  A Tank that points its gun towards the pointer

  A ball that circles the tank

  A line that has its' endpoints moving in circles
*/
import {
  rectangle,
  stage,
  line,
  circle,
  makeCanvas,
  render,
} from "../lib/importer.js";
import { makePointer } from "../lib/interactive.js";
import { angle, rotateSprite, rotatePoint } from "../lib/utils.js";

// vars shared between functions
let canvas, turret, gun, ball, wobblyLine, pointer;

// run setUp()
setUp();
function setUp() {
  // set up the canvas & stage
  canvas = makeCanvas(256, 256, "4px solid darkred", "goldenrod");

  stage.width = canvas.width;
  stage.height = canvas.height;

  // create an interactive pointer/cursor for touch/pen/mouse
  pointer = makePointer(canvas);

  // ****** The Tank ****** \\
  // make the gun turret (the square)
  turret = rectangle(32, 32, "grey", "black", 2);
  stage.putCenter(turret);

  // Make the gun barrel
  gun = line("red", 4, 0, 0, 32, 0);

  turret.addChild(gun);
  gun.x = 16;
  gun.y = 16;
  // ****** End Tank ****** \\

  // ****** Sprite To Rotate Around The Tank ****** \\
  ball = circle(32, "darkgreen", "yellow", 1);
  // position the sprite
  turret.putLeft(ball, -64);

  // Add an angle property to use to rotate the sprite around the turret
  ball.angle = 0;

  // ****** A wobbly line that uses the rotatePoint function ****** \\
  wobblyLine = line("black", 6, 64, 208, 192, 216);

  // Add two angle properties to the wobblyLine so that
  // we can make the line's end points rotate in space
  wobblyLine.angleA = 0;
  wobblyLine.angleB = 0;

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  // ****** Interactive Gun Turret Follows Pointer ****** \\
  // Make the turret rotate towards the pointer
  turret.rotation = angle(turret, pointer);

  // ****** Circling Ball ****** \\
  // Update the ball's rotation angle
  ball.angle += 0.05;
  // Make the ball sprite rotate around the turret
  // using the ball's angle value at a distance of 48px
  rotateSprite(ball, turret, 64, ball.angle);

  // ****** Wobbly Line ****** \\
  // make the lines ax amd ay points rotate clockwise
  // around 64, 160. rotatePoint() returns an object
  // with x and y properties containing the point's
  // new rotated position
  wobblyLine.angleA += 0.1;
  let rotatingA = rotatePoint(64, 208, 20, 20, wobblyLine.angleA);
  wobblyLine.ax = rotatingA.x;
  wobblyLine.ay = rotatingA.y;

  // make the line's bx and by points rotate anti-clockwise
  // around 190, 160
  wobblyLine.angleB += -0.1;
  let rotatingB = rotatePoint(190, 216, 20, 20, wobblyLine.angleB);
  wobblyLine.bx = rotatingB.x;
  wobblyLine.by = rotatingB.y;

  render(canvas);
}
