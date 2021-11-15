// A moving Tank
import { assets } from "../lib/assets.js";

import {
  makeCanvas,
  render,
  stage,
  group,
  line,
  rectangle,
  text,
  circle,
  remove,
} from "../lib/importer.js";

import { contain } from "../lib/utils.js";

import { keyboard } from "../lib/interactive.js";

assets.load(["../fonts/puzzler.otf"]).then(() => setup());

let canvas,
  tank,
  tankSpeed = 0,
  message,
  messageX,
  messageY,
  msgSide,
  msgTankSpeed,
  bullets = [];

// The bullet Sprite function
// let bulletSprite = () => circle(8, "red");

// A Shoot Function
function shoot(
  shooter,
  angle,
  offsetFromCenter,
  bulletSpeed,
  bulletArray,
  bulletSprite
) {
  // make a new sprite using the bulletSprite() function
  let bullet = bulletSprite();

  // set the bullet's start point
  bullet.x =
    shooter.centerX - bullet.halfWidth + offsetFromCenter * Math.cos(angle);
  bullet.y =
    shooter.centerY - bullet.halfHeight + offsetFromCenter * Math.sin(angle);

  // set the bullets velocity
  bullet.vx = Math.cos(angle) * bulletSpeed;
  bullet.vy = Math.sin(angle) * bulletSpeed;
  console.log(`tank.vx ${tank.vx} tank.vy: ${tank.vy}`);

  // push the bullet into the bullet array
  bulletArray.push(bullet);
  console.log(bulletArray);
}

function setup() {
  // set up the canvas and stage
  canvas = makeCanvas(
    window.innerWidth - 16,
    window.innerHeight - 16,
    "4px solid darkred",
    "goldenrod"
  );
  stage.width = canvas.width;
  stage.height = canvas.height;

  // set up text displays
  message = text("0", "14px puzzler", "rgba(50, 50, 50, 1", 4, 4);
  messageX = text("X:0", "14px puzzler", "rgba(50, 50, 50, 1", 4, 22);
  messageY = text("Y:0", "14px puzzler", "rgba(50, 50, 50, 1", 4, 40);
  msgSide = text("side", "14px puzzler", "rgba(50, 50, 50, 1", 4, 58);
  msgTankSpeed = text(
    `speed: ${tankSpeed}`,
    "14px puzzler",
    "rgba(50, 50, 50, 1",
    4,
    76
  );

  // ****** make the tank ****** \\
  let leftTrack = rectangle(40, 8, "rgba(75, 75, 75, 1)", "black", 1);
  let rightTrack = rectangle(40, 8, "rgba(75, 75, 75, 1)", "black", 1);
  //   leftTrack.x = -4;
  //   leftTrack.y = -2;
  //   rightTrack.x = -4;
  //   leftTrack.y = 26;
  let box = rectangle(32, 32, "grey", "black", 1);

  box.putTop(leftTrack, 0, 7);
  box.putBottom(rightTrack, 0, -7);

  let turret = rectangle(16, 16, "rgba(75, 75, 75, 1)", "black", 1);
  box.putCenter(turret);
  let gun = line("red", 4, 0, 0, 32, 0);
  gun.x = 16;
  gun.y = 16;

  tank = group(leftTrack, rightTrack, box, turret, gun);
  stage.putCenter(tank);

  // Add some physics properties
  tank.vx = 0;
  tank.vy = 0;
  tank.accelerationX = 0.2;
  tank.accelerationY = 0.2;
  tank.frictionX = 0.96;
  tank.frictionY = 0.96;

  // initialise tank rotation speed to zero
  tank.rotationSpeed = 0;

  // initialise tank forward movement
  tank.moveForward = false;
  tank.moveBackwards = false;

  // setup the keyboard keys
  let leftArrow = keyboard(37),
    rightArrow = keyboard(39),
    upArrow = keyboard(38),
    downArrow = keyboard(40),
    space = keyboard(32);

  space.press = () => {
    shoot(tank, tank.rotation, 32, 7, bullets, () => circle(8, "red"));
  };

  // setup the rotation speed for the keft arrow
  leftArrow.press = () => {
    tank.rotationSpeed = -0.05;
  };
  // if left arrow is released and the right arrow is up
  // set rotation speed to zero
  leftArrow.release = () => {
    if (!rightArrow.isDowm) {
      tank.rotationSpeed = 0;
    }
  };

  // do the same for the right arrow
  rightArrow.press = () => {
    tank.rotationSpeed = 0.05;
  };

  rightArrow.release = () => {
    if (!leftArrow.isDown) {
      tank.rotationSpeed = 0;
    }
  };

  // setup the tank movement
  upArrow.press = () => {
    tank.moveForward = true;
  };

  upArrow.release = () => {
    tank.moveForward = false;
  };

  downArrow.press = () => {
    tank.moveBackwards = true;
  };

  downArrow.release = () => {
    tank.moveBackwards = false;
  };

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  // use the rotation speed to rotate the tank
  tank.rotation += tank.rotationSpeed;

  // ue a bit of triginometry to move the tank in
  // the direction of rotation if moveForward is true
  if (tank.moveForward) {
    tank.vx += tank.accelerationX * Math.cos(tank.rotation);
    tank.vy += tank.accelerationY * Math.sin(tank.rotation);
  }
  // if tank.moveForward is false, use
  // friction to slow the tank down
  if (!tank.moveForward && !tank.moveBackwards) {
    tank.vx *= tank.frictionX;
    tank.vy *= tank.frictionY;
  }

  if (tank.moveBackwards) {
    tank.vx -= tank.accelerationX * Math.cos(tank.rotation);
    tank.vy -= tank.accelerationY * Math.sin(tank.rotation);
  }

  // apply the tank's velocity to it's position to make it move
  tank.x += tank.vx;
  tank.y += tank.vy;

  // contain the tank within the stage boundries
  let edges = contain(tank, stage.localBounds, true);

  message.content = `rotation ${tank.rotation}`;
  messageX.content = `X: ${Math.floor(tank.centerX)}`;
  messageY.content = `Y: ${Math.floor(tank.centerY)}`;

  // ****** Bullets ****** \\

  bullets = bullets.filter((bullet) => {
    // If the tank isn't moving backwards check tank.moveForwards
    // and tank.frictionX (applied)
    // move the bullets and add tank velocity
    // so that the  tank doesn't run into its own bullets
    if (!tank.moveBackwards) {
      bullet.x += bullet.vx + tank.vx;
      bullet.y += bullet.vy + tank.vy;
    } else {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;
    }

    // console.log(bullet.vx, bullet.vy, tank.vx);

    // check for collision with the stage boundary
    let collision = outsideBounds(bullet, stage.localBounds);

    // if there's a collision, display the side that the collision
    // happened on, remove the bullet sprite and filter it out of
    // the bullets array
    if (collision) {
      msgSide.content = `The bullet hit the ${collision}`;

      // the remove function will remove a sprite from its parent
      // to make it disappear
      remove(bullet);

      // remove the bullet from the bullets array
      return false;
    }

    // If the bullet hasn't hit the edge of the stage,
    // keep it in the bullets array
    return true;
  });

  render(canvas);
}

// The outsideBounds function returns a collision vairable with
// a value of top, bottom, left or right, or undefined if there
// is no collision. It checks if the entire shape of the sprite
// has crossed the boundary and leaves it up to us to decide
// what to do with that info
function outsideBounds(sprite, bounds, extra = undefined) {
  let x = bounds.x,
    y = bounds.y,
    width = bounds.width,
    height = bounds.height;

  // store which side of the boundary the sprite hits
  let collision;

  // left
  if (sprite.x < x - sprite.width) {
    collision = "left";
  }

  // top
  if (sprite.y < y - sprite.height) {
    collision = "top";
  }

  // right
  if (sprite.x > width) {
    collision = "right";
  }

  // bottom
  if (sprite.y > height) {
    collision = "bottom";
  }

  // run the `extra` function, if defined, and there was a collision
  if (collision && extra) extra(collision);
  return collision;
}
