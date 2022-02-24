// A moving tank that moves like a real wheeled vehicle
// and a whole host of other interactive stuff
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
  frames,
  particles,
  particleEffect,
  draggableSprites,
  tilingSprite,
} from "../lib/importer.js";

import { angle, contain, randomInt } from "../lib/utils.js";

import { keyboard, makePointer } from "../lib/interactive.js";

import {
  hit,
  rectangleCollision,
  circleRectangleCollision,
} from "../lib/collision.js";

assets
  .load([
    "../fonts/puzzler.otf",
    "../images/button.json",
    "../images/tile2.png",
    "../audio/test.wav",
    "../audio/Cm.wav",
    "../audio/music.wav",
  ])
  .then(() => setup());

let tile,
  canvas,
  colours = ["Gold", "Purple", "Crimson", "DarkSeaGreen"],
  tank,
  tankSpeed = 0,
  pingSound,
  message,
  messageX,
  messageY,
  msgSide,
  msgTankSpeed,
  msgHitTest,
  msgScore,
  music,
  stateMessage,
  actionMessage,
  playButton,
  bullets = [],
  forwardBtn,
  backBtn,
  leftBtn,
  rightBtn,
  tankCtrls,
  ball,
  score = 0,
  pointer,
  walls,
  finish;

function setup() {
  // set up the canvas and stage
  canvas = makeCanvas(
    window.innerWidth - 16,
    window.innerHeight - 16,
    "4px solid darkred",
    "#111"
  );
  stage.width = canvas.width;
  stage.height = canvas.height;

  // Set up the sounds
  music = assets["../audio/music.wav"];
  music.loop = true;
  music.setReverb(8, 2, true);
  music.volume = 2;
  music.playbackRate = 1.5;
  music.play();

  let shootSound = assets["../audio/test.wav"];
  shootSound.volume = 0.15;
  console.log(shootSound.volume);

  pingSound = assets["../audio/Cm.wav"];
  pingSound.volume = 8;
  pingSound.setReverb(2, 2, false);

  // tile2d background
  tile = tilingSprite(
    canvas.width,
    canvas.height,
    assets["../images/tile2.png"]
  );

  /* ****** The walls ****** */
  // A group for all the blocks that make the walls
  walls = group();

  // set the initial gap size between the walls
  let gapSize = 4;

  // calc the size of blocks to build the walls
  let blockSize = canvas.height / 8;

  // set the number of walls
  let numberOfWalls = 25;

  // loop to create the walls
  for (let i = 0; i < numberOfWalls; i++) {
    // randomly place the gap somewhere inside the wall
    let startGapNumber = randomInt(0, 8 - gapSize);

    // reduce the gap size every 5 walls
    if (i > 0 && gapSize > 1 && i % 5 === 0) gapSize -= 1;

    // create a block for the wall if its not in the range
    // of numbers occupied by the gap
    for (let j = 0; j < 8; j++) {
      if (j < startGapNumber || j > startGapNumber + gapSize) {
        let block = rectangle(blockSize, blockSize, "grey");
        walls.addChild(block);

        // space each wall 384 pixels apart
        block.x = i * 384 + (canvas.width - blockSize);
        block.y = j * blockSize;
      }

      // create the finish text
      if (i === numberOfWalls - 1) {
        finish = text(
          "Finish",
          "64px puzzler",
          "red",
          i * 384 + canvas.width * 1.5,
          canvas.height / 2
        );

        canvas.ctx.font = "64px puzzler";
        finish.width = canvas.ctx.measureText(finish).width;
        console.log(finish.content, finish.width);

        walls.addChild(finish);
      }
    }
  }

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
  msgHitTest = text(
    "pointer hit:",
    "14px puzzler",
    "rgba(50, 50, 50, 1",
    4,
    94
  );

  msgScore = text("score:", "14px puzzler", "rgba(50, 50, 50, 1", 4, 146);

  // The bullet Sprite function
  // let bulletSprite = () => circle(8, "red");

  // A Shoot Function utilising particle effect
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
    // console.log(bulletArray);

    // particles
    particleEffect(
      tank.x + 16 + 36 * Math.cos(tank.rotation),
      tank.y + 16 + 36 * Math.sin(tank.rotation),

      // NB: the width and height params of the sprite do nothing,
      // as this is overriden by min/max size of the particleEffect
      // e.g. using the rectangle sprite
      () => circle(1, "rgba(255, 255, 155, 1)", "none"),

      100, // num particles
      0.0, // gravity
      true, // random spacing
      tank.rotation, // min angle
      tank.rotation, // max angle
      1, // min size
      2, // max size
      0.1, // min speed
      7.5, // max speed
      0.005, // min scale speed
      0.01, // max scale speed
      0.05, // min alpha speed
      0.05, // max alpha speed
      // set min & max rotation to zero for non-rotating particles
      // set min or max to a negative value to rotate CW & ACW
      -0, // min rotation speed
      0 // max rotation speed
    );
  }

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
  tank.draggable = true;

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
    shoot(tank, tank.rotation, 32, 7, bullets, () => circle(8, "red"));
    shootSound.play();
  };

  // setup the rotation speed for the left arrow
  leftArrow.press = () => {
    tank.rotationSpeed = -0.05;
  };
  // if left arrow is released and the right arrow is up
  // set rotation speed to zero
  leftArrow.release = () => {
    if (!rightArrow.isDown) {
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

  // ****** Interactive Button ****** \\
  //Note: This shouldn't really be in this file!

  // Define the button's frames:
  let buttonFrames = [assets["up.png"], assets["over.png"], assets["down.png"]];

  // Make the button sprite:
  playButton = button(buttonFrames, 32, stage.height - 128);
  // playButton.press = () => {
  //   shoot(tank, tank.rotation, 32, 7, bullets, () => circle(8, "red"));
  // };
  // console.log("button height", playButton.height);

  // define the button's actions:
  playButton.over = () => console.log("over");
  playButton.out = () => console.log("out");
  playButton.press = () => {
    shootSound.play();
    shoot(tank, tank.rotation, 32, 7, bullets, () => circle(8, "red"));
    console.log("press");
  };
  playButton.release = () => console.log("release");
  // playButton.tap = () => {
  //   shoot(tank, tank.rotation, 32, 7, bullets, () => circle(8, "red"));
  //   console.log("tap");
  // };

  // Add some message text:
  stateMessage = text("state:", "14px puzzler", "rgba(50, 50, 50, 1", 4, 112);
  actionMessage = text("action:", "14px puzzler", "rgba(50, 50, 50, 1", 4, 130);

  // ****** Interactive Clickable Sprites ****** \\
  ball = circle(96, "red", "blue", 8);
  stage.putCenter(ball, stage.halfWidth / 2, stage.halfHeight / 2);

  // Make the ball interactive
  ball.interactive = true;
  // make it draggable
  ball.draggable = true;

  // assign the ball's press method
  ball.press = () => {
    // An array of colours
    // colours = ["Gold", "Purple", "Crimson", "DarkSeaGreen"];

    // set the ball's fill and stroke style to a random colour
    ball.fillStyle = colours[randomInt(0, colours.length - 1)];
    ball.strokeStyle = colours[randomInt(0, colours.length - 1)];
  };

  // test if the pointer touches the ball
  pointer.hitTestSprite(ball);

  // test if the pointer hits the button so
  // we can update the msgHitTest text content
  pointer.hitTestSprite(playButton);

  // Work In Progress:- *****************
  // ****** Tank Control Buttons ****** \\

  forwardBtn = rectangle(48, 48, "darkgrey", "black", 8);
  backBtn = rectangle(48, 48, "grey", "black", 8);
  leftBtn = rectangle(48, 48, "lightgrey", "black", 8);
  rightBtn = rectangle(48, 48, "lightgrey", "black", 8);

  forwardBtn.interactive = true;
  backBtn.interactive = true;
  leftBtn.interactive = true;
  rightBtn.interactive = true;

  forwardBtn.putBottom(backBtn, 0, backBtn.lineWidth * 1.5);
  forwardBtn.putLeft(
    leftBtn,
    -forwardBtn.halfWidth * 0.5,
    forwardBtn.halfHeight
  );
  forwardBtn.putRight(rightBtn, rightBtn.lineWidth * 1.5, rightBtn.halfHeight);

  tankCtrls = group(forwardBtn, backBtn, leftBtn, rightBtn);

  tankCtrls.setPosition(
    canvas.width - (tankCtrls.width + backBtn.lineWidth),
    canvas.height - (tankCtrls.height + backBtn.lineWidth)
  );

  pointer.hitTestSprite(forwardBtn);
  pointer.hitTestSprite(backBtn);
  pointer.hitTestSprite(leftBtn);
  pointer.hitTestSprite(rightBtn);

  forwardBtn.press = () => {
    tank.moveForward = true;
  };
  forwardBtn.release = () => {
    tank.moveForward = false;
  };

  backBtn.press = () => {
    tank.moveBackwards = true;
    console.log("press");
  };
  backBtn.release = () => {
    tank.moveBackwards = false;
  };

  leftBtn.press = () => {
    tank.rotationSpeed = -0.05;
  };
  leftBtn.release = () => {
    tank.rotationSpeed = 0;
  };

  rightBtn.press = () => {
    tank.rotationSpeed = 0.05;
  };
  rightBtn.release = () => {
    tank.rotationSpeed = 0;
  };

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  // move the floor  and walls while the finish text has
  // not reached the center of the canvas
  // console.log(finish.gx);

  if (finish.gx > canvas.width * 0.5 - finish.width * 0.25) {
    tile.tileX -= 2;
    walls.x -= 2;
  } else music.stop();

  // use the `rotationSpeen` to set the tank's rotation
  tank.rotation += tank.rotationSpeed;

  // if tank.moveForward is true, increase the speed
  // console.log("tank.moveForward:", tank.moveForward);
  // console.log("forwardBtn.release", forwardBtn.release);
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

  // contain the tank within the stage boundries and
  // set speed to zero if it collides with the edges
  let edgesTankCollision = contain(
    tank,
    stage.localBounds,
    true,
    () => (tank.speed = 0)
  );

  // make it so the tank can't go under the button using
  // the rectangleCollision function
  // let buttonTankCollision = rectangleCollision(tank, playButton);
  // set the tanks speed to zero if it collides with the button
  // if (buttonTankCollision) tank.speed = 0;
  // use the circleRectangleCollision to stop the tank
  // from going under the ball
  let ballTankCollision = circleRectangleCollision(ball, tank);
  if (ballTankCollision) {
    tank.speed = 0;
    tank.moveForward = false;
    tank.moveBackwards = false;
  }
  // contain the ball within the stage boundries
  let ballEdgeCollision = contain(ball, stage.localBounds, true);

  message.content = `rotation ${tank.rotation}`;
  messageX.content = `x: ${Math.floor(tank.centerX)}`;
  messageY.content = `y: ${Math.floor(tank.centerY)}`;
  msgTankSpeed.content = `speed: ${Math.floor(tank.speed * 10)}`;

  if (pointer.hitTestSprite(tank)) {
    msgHitTest.content = "pointer hit: tank";
  } else if (pointer.hitTestSprite(playButton)) {
    msgHitTest.content = "pointer hit: playButton";
  } else if (pointer.hitTestSprite(ball)) {
    msgHitTest.content = "pointer hit: ball";
  } else if (pointer.hitTestSprite(forwardBtn)) {
    msgHitTest.content = "pointer hit: forwardBtn";
  } else if (pointer.hitTestSprite(leftBtn)) {
    msgHitTest.content = "pointer hit: leftBtn";
  } else if (pointer.hitTestSprite(backBtn)) {
    msgHitTest.content = "pointer hit: backBtn";
  } else if (pointer.hitTestSprite(rightBtn)) {
    msgHitTest.content = "pointer hit: rightBtn";
  } else msgHitTest.content = "pointer hit: nothing";

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

    // check if bullet hit ball

    if (ball) {
      let hitBall = hit(ball, bullet, true, true, true);

      if (hitBall) {
        pingSound.play();
        score++;
        msgScore.content = `score: ${score}`;
        // set the ball's fill and stroke style to a random colour
        ball.fillStyle = colours[randomInt(0, colours.length - 1)];
        ball.strokeStyle = colours[randomInt(0, colours.length - 1)];

        // make sure the fill style and stroke style are different
        if (ball.fillStyle === ball.strokeStyle) {
          ball.strokeStyle = "blue";
        }

        ball.diameter *= 0.9;
        ball.lineWidth *= 0.9;

        if (ball.diameter < bullet.diameter * 4) {
          score += 100;
          // remove the ball from its parent and set it as an
          // empty object so the tank can't interact with it
          remove(ball);
          // ball = undefined;
          // empty the bullet array to prevent collision errors
          bullets = [];
          // shoot = () => console.log("Game Over");

          stage.putCenter(msgScore, -msgScore.width);
          msgScore.content = `****** YOU WIN! ****** ${score}`;
          // shoot = () => console.log("Game Over");
          // space.press = () => {
          //   msgSide.fillStyle = "red";
          //   msgSide.content = "Out of Amo!!!";
          // };

          // playButton.tap = () => {
          //   msgSide.fillStyle = "red";
          //   msgSide.content = "Out of Amo!!!";
          // };
        }

        remove(bullet);

        return false;
      }
    }

    // check if the bullet hits the stage boundary
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

  // ****** Update the buttons / interactive sprites ****** \\
  if (buttons.length > 0) {
    canvas.style.cursor = "auto";
    buttons.forEach((button) => {
      button.update(pointer, canvas);
      if (button.state === "over" || button.state === "down") {
        if (button.parent !== undefined) {
          canvas.style.cursor = "pointer";
          button.update(pointer, canvas);
        }
      }
    });
  }

  // display the  button's state and action
  stateMessage.content = `state: ${playButton.state}`;
  actionMessage.content = `action: ${playButton.action}`;

  // update the pointer's drag and drop system
  pointer.updateDragAndDrop(draggableSprites);

  // loop through the particles array in reverse so that
  // we can safely remove the particle without throwing the loop out by one
  if (particles.length > 0) {
    for (let i = particles.length - 1; i >= 0; i--) {
      let particle = particles[i];
      particle.update();
    }
  }

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
