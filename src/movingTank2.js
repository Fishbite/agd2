// A moving tank that moves like a real wheeled vehicle
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
  button,
  buttons,
} from "../lib/importer.js";

import { contain } from "../lib/utils.js";

import { keyboard, makePointer } from "../lib/interactive.js";

assets
  .load(["../fonts/puzzler.otf", "../images/button.png"])
  .then(() => setup());

let canvas,
  tank,
  tankSpeed = 0,
  message,
  messageX,
  messageY,
  msgSide,
  msgTankSpeed,
  msgHitTest,
  bullets = [],
  pointer,
  buttonFrames = [
    assets["up.png"],
    assets["over.png"],
    assets["down.png"],
    (playButton = button(buttonFrames, 32, 96)),
  ];

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

  // make a pointer
  pointer = makePointer(canvas, 1);

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
  msgHitTest = text("no hit", "14px puzzler", "rgba(50, 50, 50, 1", 4, 94);

  // ****** make the tank ****** \\
  // ****** tank behaves like a real wheeled vehicle ****** \\
  let leftTrack = rectangle(40, 8, "rgba(75, 75, 75, 1)", "black", 1);
  let rightTrack = rectangle(40, 8, "rgba(75, 75, 75, 1)", "black", 1);

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
  tank.accelerationX = 0.1;
  tank.accelerationY = 0.1;
  tank.rotationSpeed = 0;
  tank.moveForward = false;
  // tank.friction replaces frictionX & frictionY
  tank.friction = 0.96;
  // use speed to determine how fast the tank should move
  tank.speed = 0;

  // setup the keyboard keys
  let leftArrow = keyboard(37),
    rightArrow = keyboard(39),
    upArrow = keyboard(38),
    downArrow = keyboard(40),
    space = keyboard(32);

  space.press = () => {
    shoot(tank, tank.rotation, 32, 7, bullets, () =>
      line("red", 8, 0, 0, 24, 0)
    );
  };

  // setup the rotation speed for the left arrow
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

  // test if the pointer touches the tank
  pointer.hitTestSprite(tank);

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  // use the `rotationSpeen` to set the tank's rotation
  tank.rotation += tank.rotationSpeed;

  // if tank.moveForward is true, increase the speed
  if (tank.moveForward) {
    tank.speed += 0.1;
  } else if (tank.moveBackwards) {
    tank.speed -= 0.1;
  }
  // if tank.moveForward is false, use friction to slow it down
  else if (!tank.moveForward && !tank.moveBackwards) {
    tank.speed *= tank.friction;
  }

  // use the `speed` value to figure out the acceleration
  // in the direction of the tank's rotation
  tank.accelerationX = tank.speed * Math.cos(tank.rotation);
  tank.accelerationY = tank.speed * Math.sin(tank.rotation);

  // apply the acceleration to the tank's velocity
  tank.vx = tank.accelerationX;
  tank.vy = tank.accelerationY;

  // Apply the tank's velocity to its position to make the tank move
  tank.x += tank.vx;
  tank.y += tank.vy;

  // contain the tank within the stage boundries
  let edges = contain(tank, stage.localBounds, true);

  message.content = `rotation ${tank.rotation}`;
  messageX.content = `x: ${Math.floor(tank.centerX)}`;
  messageY.content = `y: ${Math.floor(tank.centerY)}`;
  msgTankSpeed.content = `speed: ${Math.floor(tank.speed * 10)}`;

  if (pointer.hitTestSprite(tank)) {
    msgHitTest.content = "tank";
  } else msgHitTest.content = "nowt";

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
