import {
  makeCanvas,
  stage,
  render,
  sprite,
  frames,
  circle,
  rectangle,
  arc,
  line,
  draggableSprites,
  buttons,
} from "../lib/importer.js";
import { assets } from "../lib/assets.js";
import { randomInt } from "../lib/utils.js";
import { makePointer } from "../lib/interactive.js";

assets.load(["../images/fairy.png"]);

// loop through this array to update all the particles
// on each frame in the gameLoop()
export let particles = [];

export function particleEffect(
  x = 0,
  y = 0,
  spriteFunction = () => circle(10, "goldenrod"),
  numberOfParticles = 10,
  gravity = 0,
  randomSpacing = true,
  minAngle = 0,
  maxAngle = 6.28,
  minSize = 4,
  maxSize = 16,
  minSpeed = 0.1,
  maxSpeed = 1,
  minScaleSpeed = 0.01,
  maxScaleSpeed = 0.05,
  minAlphaSpeed = 0.02,
  maxAlphaSpeed = 0.02,
  minRotationSpeed = 0.01,
  maxRotationSpeed = 0.03
) {
  // random float and random integer functions
  let randomFloat = (min, max) => min + Math.random() * (max - min),
    randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // array to store the angles
  let angles = [],
    // variable to store the current particle angle
    angle;

  // figure out how many radians each particle should be separated by
  let spacing = (maxAngle * minAngle) / (numberOfParticles - 1);

  // create an angle value for each particle and
  // push that angle onto the angles array
  for (let i = 0; i < numberOfParticles; i++) {
    // if randomSpacing is true, give the particle any angle
    // between minAngle & maxAngle
    if (randomSpacing) {
      angle = randomFloat(minAngle, maxAngle);
      angles.push(angle);
    }

    // if randomSpacing is false, space each particle evenly
    // starting with minAngle ane ending at maxAngle
    else {
      if (angle === undefined) angle = minAngle;
      angles.push(angle);
      angle += spacing;
    }
  }

  // make a particle for each angle
  angles.forEach((angle) => makeParticle(angle));

  // make the particle
  function makeParticle(angle) {
    // create the particle using the supplied sprite function
    let particle = spriteFunction();

    // display a random frame if the particle has more than one frame
    if (particle.frames.length > 0) {
      let randomNum = randomInt(0, particle.frames.length - 1);
      console.log(randomNum);
      particle.gotoAndStop(randomNum);
    }

    // set the particle's x / y position
    particle.x = x - particle.halfWidth;
    particle.y = y - particle.halfHeight;

    // set a random width and height
    let size = randomInt(minSize, maxSize);
    particle.width = size;
    particle.height = size;

    // set a random speed to change the scale, alpha and rotation
    particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
    particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed);
    particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed);

    // set a random velocity at which the particle should move
    let speed = randomFloat(minSpeed, maxSpeed);
    particle.vx = speed * Math.cos(angle);
    particle.vy = speed * Math.sin(angle);

    // the particle's update method is called on each frame of the gameLoop
    particle.update = () => {
      // add gravity
      particle.vy += gravity;

      // move the particle
      particle.x += particle.vx;
      particle.y += particle.vy;

      // change t he particle's scale
      if (particle.scaleX - particle.scaleSpeed > 0) {
        particle.scaleX -= particle.scaleSpeed;
      }
      if (particle.scaleY - particle.scaleSpeed > 0) {
        particle.scaleY -= particle.scaleSpeed;
      }

      // change the particle's roatation
      particle.rotation += particle.rotationSpeed;

      // change the particle's alhpa
      particle.alpa -= particle.alphaSpeed;

      // remove the particle if its alpha reaches 0
      if (particle.alpha <= 0) {
        console.log(particle);
        remove(particle);

        particles.splice(particles.indexOf(particle), 1);
      }
    };

    // push the particle into the particles array
    particles.push(particle);
  }
}

let canvas, pointer;

setup();
function setup() {
  canvas = makeCanvas();
  canvas.style.backgroundColor = "black";
  stage.width = canvas.width;
  stage.height = canvas.height;

  pointer = makePointer(canvas, 1);

  // we can even use frames as particle images
  let fairyFrames = frames(
    assets["../images/fairy.png"],
    [
      [0, 0],
      [0, 48],
      [0, 96],
      [0, 144],
    ],
    48,
    32
  );

  let fairy = sprite(fairyFrames);
  stage.putCenter(fairy);

  fairy.interactive = true;
  fairy.draggable = true;
  // pointer.hitTestSprite(fairy); // don't need this

  // We've stored the particle effect in a variable so that we can
  // simply define our sprite interactions like this:
  // sprite.press = doThis; sprite.tap = doThis etc...
  let doThis = () => {
    particleEffect(
      pointer.x,
      pointer.y,
      // NB: the width and height params of the sprite do nothing,
      // as this is overriden by min/max size of the particleEffect
      // e.g. using the rectangle sprite
      () => rectangle(1, 1, "rgba(0,0,0,0)", "goldenrod", 1),
      // () =>
      //   arc(
      //     "",
      //     "rgba(0,0,0,0)",
      //     "goldenrod",
      //     2,
      //     1.57,
      //     6.28,
      //     "",
      //     "",
      //     false,
      //     false
      //   ),
      // () =>
      //   line(
      //     "goldenrod",
      //     0.25,
      //     pointer.x - 200,
      //     pointer.y,
      //     pointer.x,
      //     pointer.y
      //   ),
      // () => sprite(fairyFrames),
      250, // num particles
      0.0, // gravity
      true, // random spacing
      0, // min angle
      6.28, // max angle
      2, // min size
      24, // max size
      1, // min speed
      2, // max speed
      0.005, // min scale speed
      0.01, // max scale speed
      0.005, // min alpha speed
      0.01, // max alpha speed
      // set min & max rotation to zero for non-rotating particles
      // set min or max to a negative value to rotate CW & ACW
      -0.1, // min rotation speed
      0.1 // max rotation speed
    );
  };

  // enable this to create a particle burst anywhere on the canvas
  // pointer.press = doThis;

  // pointer.press = () => {
  //   console.log("pressed", buttons);
  //   particleEffect(
  //     pointer.x,
  //     pointer.y,
  //     // NB: the width and height params of the sprite do nothing,
  //     // as this is overriden by min/max size of the particleEffect
  //     // e.g. using the rectangle sprite
  //     () => rectangle(1, 1, "rgba(0,0,0,0)", "goldenrod", 1),
  //     // () =>
  //     //   arc(
  //     //     "",
  //     //     "rgba(0,0,0,0)",
  //     //     "goldenrod",
  //     //     2,
  //     //     1.57,
  //     //     6.28,
  //     //     "",
  //     //     "",
  //     //     false,
  //     //     false
  //     //   ),
  //     // () =>
  //     //   line(
  //     //     "goldenrod",
  //     //     0.25,
  //     //     pointer.x - 200,
  //     //     pointer.y,
  //     //     pointer.x,
  //     //     pointer.y
  //     //   ),
  //     // () => sprite(fairyFrames),
  //     250, // num particles
  //     0.0, // gravity
  //     true, // random spacing
  //     0, // min angle
  //     6.28, // max angle
  //     2, // min size
  //     24, // max size
  //     1, // min speed
  //     2, // max speed
  //     0.005, // min scale speed
  //     0.01, // max scale speed
  //     0.005, // min alpha speed
  //     0.01, // max alpha speed
  //     // set min & max rotation to zero for non-rotating particles
  //     // set min or max to a negative value to rotate CW & ACW
  //     -0.1, // min rotation speed
  //     0.1 // max rotation speed
  //   );
  // };

  fairy.press = doThis;
  // if .tap is enabled, the fairy is behind the particles???
  // however if .press is enabled instead, the fairy is in front???

  // fairy.press = () => {
  //   console.log("tapped");
  //   particleEffect(
  //     pointer.x,
  //     pointer.y,
  //     // NB: the width and height params of the sprite do nothing,
  //     // as this is overriden by min/max size of the particleEffect
  //     // e.g. using the rectangle sprite
  //     () => rectangle(1, 1, "rgba(0,0,0,0)", "goldenrod", 1),
  //     // () =>
  //     //   arc(
  //     //     "",
  //     //     "rgba(0,0,0,0)",
  //     //     "goldenrod",
  //     //     2,
  //     //     1.57,
  //     //     6.28,
  //     //     "",
  //     //     "",
  //     //     false,
  //     //     false
  //     //   ),
  //     // () =>
  //     //   line(
  //     //     "goldenrod",
  //     //     0.25,
  //     //     pointer.x - 200,
  //     //     pointer.y,
  //     //     pointer.x,
  //     //     pointer.y
  //     //   ),
  //     // () => sprite(fairyFrames),
  //     250, // num particles
  //     0.0, // gravity
  //     true, // random spacing
  //     0, // min angle
  //     6.28, // max angle
  //     2, // min size
  //     24, // max size
  //     1, // min speed
  //     2, // max speed
  //     0.005, // min scale speed
  //     0.01, // max scale speed
  //     0.005, // min alpha speed
  //     0.01, // max alpha speed
  //     // set min & max rotation to zero for non-rotating particles
  //     // set min or max to a negative value to rotate CW & ACW
  //     -0.1, // min rotation speed
  //     0.1 // max rotation speed
  //   );
  // };

  // fairy.tap = doThis;
  // if .tap is enabled, the fairy is behind the particles???
  // however if .press is enabled instead, the fairy is in front???

  // fairy.tap = () => {
  //   console.log("tapped");
  //   particleEffect(
  //     pointer.x,
  //     pointer.y,
  //     // NB: the width and height params of the sprite do nothing,
  //     // as this is overriden by min/max size of the particleEffect
  //     // e.g. using the rectangle sprite
  //     () => rectangle(1, 1, "rgba(0,0,0,0)", "goldenrod", 1),
  //     // () =>
  //     //   arc(
  //     //     "",
  //     //     "rgba(0,0,0,0)",
  //     //     "goldenrod",
  //     //     2,
  //     //     1.57,
  //     //     6.28,
  //     //     "",
  //     //     "",
  //     //     false,
  //     //     false
  //     //   ),
  //     // () =>
  //     //   line(
  //     //     "goldenrod",
  //     //     0.25,
  //     //     pointer.x - 200,
  //     //     pointer.y,
  //     //     pointer.x,
  //     //     pointer.y
  //     //   ),
  //     // () => sprite(fairyFrames),
  //     250, // num particles
  //     0.0, // gravity
  //     true, // random spacing
  //     0, // min angle
  //     6.28, // max angle
  //     2, // min size
  //     24, // max size
  //     1, // min speed
  //     2, // max speed
  //     0.005, // min scale speed
  //     0.01, // max scale speed
  //     0.005, // min alpha speed
  //     0.01, // max alpha speed
  //     // set min & max rotation to zero for non-rotating particles
  //     // set min or max to a negative value to rotate CW & ACW
  //     -0.1, // min rotation speed
  //     0.1 // max rotation speed
  //   );
  // };
  console.log("buttons:", buttons);

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  // loop through the particles array in reverse so that
  // we can safely remove the particle without throwing the loop out by one
  if (particles.length > 0) {
    for (let i = particles.length - 1; i >= 0; i--) {
      let particle = particles[i];
      particle.update();
    }
  }

  //Update the buttons
  if (buttons.length > 0) {
    canvas.style.cursor = "auto";
    buttons.forEach((button) => {
      button.update(pointer, canvas);
    });
  }

  //update the pointer's drag and drop system
  pointer.updateDragAndDrop(draggableSprites);

  render(canvas);
}
