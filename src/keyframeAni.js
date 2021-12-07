console.log("All cool and we're good to go :o)");

import { assets } from "../lib/assets.js";

import {
  makeCanvas,
  stage,
  render,
  sprite,
  frames,
  filmstrip,
} from "../lib/importer.js";

import { keyboard } from "../lib/interactive.js";

import { contain } from "../lib/utils.js";

// ****** The addStatePlayer function ****** \\
/*
    First of all we need a function that we can
    use to display a sprite that uses tileset
    frame images. Each tileset frame image shows
    the sprite in a particular state.

    e.g. looking left or right, taking a step in
    a walking sequence etc.

    NB: This function needs to be called by
        the Sprite class so that its methods
        are available to all sprites that
        have more than one frame in a tileset.

        Thus, it needs to be included in the
        importer.js file

*/

// function addStatePlayer(sprite) {
//   // variables
//   let frameCounter = 0,
//     numberOfFrames = 0,
//     startFrame = 0,
//     endFrame = 0,
//     timerInterval = undefined;

//   // Display static states with the show function
//   function show(frameNumber) {
//     // reset any animations previously started
//     reset();

//     // find the new state on the sprite
//     sprite.gotoAndStop(frameNumber);
//   }

//   // play all the sprite's frames with this function
//   function play() {
//     playSequence([0, sprite.frames.length - 1]);
//   }

//   // stop the animation at its current frame
//   function stop() {
//     reset();
//     sprite.gotoAndStop(sprite.currentFrame);
//   }

//   // play a pre-defined sequence of frames.
//   // poperties of sprite.states object
//   // e.g. walkUp: [1, 8]
//   function playSequence(sequenceArray) {
//     // reset previous animations
//     reset();

//     // calculate the number of frames in the range
//     startFrame = sequenceArray[0];
//     endFrame = sequenceArray[1];
//     numberOfFrames = endFrame - startFrame;

//     // compensate for two edge cases
//     // 1. startFrame is 0
//     if (startFrame === 0) {
//       numberOfFrames += 1;
//       frameCounter += 1;
//     }

//     // 2. a two frame sequence is provided
//     if (numberOfFrames === 1) {
//       numberOfFrames = 2;
//       frameCounter++;
//     }

//     // calculate the frame rate. Set default to 12fps
//     if (!sprite.fps) sprite.fps = 12;
//     let frameRate = 1000 / sprite.fps;

//     // set the sprite to the starting frame
//     sprite.gotoAndStop(startFrame);

//     // if the sprite isn't already playing, start it
//     if (!sprite.playing) {
//       timerInterval = setInterval(advanceFrame.bind(this), frameRate);
//       sprite.playing = true;
//       console.log("Arse");
//     }
//   }

//   // function called by setInterval to display the next frame
//   // in the sequence based on the frameRate. When the frame
//   // sequence reaches the end it will either stop or loop
//   function advanceFrame() {
//     // advance the frame if the frameCounter is less than
//     // the states total frames
//     if (frameCounter < numberOfFrames) {
//       // goto the next frame
//       sprite.gotoAndStop(sprite.currentFrame + 1);

//       // update the frame counter
//       frameCounter += 1;

//       // start from the first frame again if we
//       // have reached the end and loop is true
//     } else {
//       if (sprite.loop) {
//         sprite.gotoAndStop(startFrame);
//         frameCounter = 1;
//       }
//     }
//   }

//   function reset() {
//     // reset sprite.playing to false and frameCounter to 0
//     if (timerInterval !== undefined && sprite.playing === true) {
//       sprite.playing = false;
//       frameCounter = 0;
//       startFrame = 0;
//       endFrame = 0;
//       numberOfFrames = 0;
//       // clear the timerInterval
//       clearInterval(timerInterval);
//     }
//   }

//   // add the methods to the sprite
//   sprite.show = show;
//   sprite.play = play;
//   sprite.stop = stop;
//   sprite.playSequence = playSequence;
// }

// ****** Filmstrip Function ****** \\
/*
    Next we need a way to create on array containing
    all the frames as separate images. We can use the
    frames() function to turn an array of position
    values into an array of images, but, if we have a
    tileset containing many frames, we don't want to
    have to manually create an array of positions.

    This custom function figures out the x/y positions
    of each frame for us and returns all the animation
    frames.

    This function also needs to be added to importer.js
*/

// export function filmstrip(image, frameWidth, frameHeight, spacing = 0) {
//   // an array to store alll the x / y positions
//   let positions = [];

//   // find out how many rows and columns there
//   // are in the tileset
//   let columns = image.width / frameWidth,
//     rows = image.height / frameHeight;

//   // find the total number of frames
//   let numberOfFrames = columns * rows;

//   for (let i = 0; i < numberOfFrames; i++) {
//     // find the correct row and column for each frame
//     // and figure out its x / y position
//     let x = (i % columns) * frameWidth,
//       y = (i % rows) * frameHeight;

//     // compensate for any optional spacing around the
//     // frames. Accumulate the spacinng offsets from
//     // the left side of the tileset and add them to
//     // the current tile's position
//     if (spacing && spacing > 0) {
//       x += spacing + ((spacing * i) % columns);
//       y += spacing + spacing * Math.floor(i / columns);
//     }

//     // add the x / y values of each frame to the
//     // positions array
//     positions.push([x, y]);
//   }

//   // create and return the animation frames using
//   // the frames() function
//   return frames(image, positions, frameWidth, frameHeight);
// }

// ****** Ready To Go! ****** \\
// use the filmstrip function to create
// the sprite's frames array in the setup()
//function

// first load the tileset image
assets
  .load(["../images/walkcycle.png", "../images/forest.png"])
  .then(() => setup());

// variables shared between functions
let canvas, elf, leftArrow, rightArrow, upArrow, downArrow;

function setup() {
  // make the canvas and stage
  canvas = makeCanvas(512, 512, "4px solid darkred", "goldenrod");
  stage.width = canvas.width;
  stage.height = canvas.height;

  // create the background forest
  let background = assets["../images/forest.png"];

  let forest = sprite(background);
  forest.width = canvas.width;
  forest.height = canvas.height;

  // create the sprite frames array
  let elfFrames = filmstrip(assets["../images/walkcycle.png"], 64, 64);

  console.log("elfFrames", elfFrames);

  // initiate the sprite using elfFrames
  elf = sprite(elfFrames);
  stage.putCenter(elf);

  // create the elf's states:
  elf.states = {
    up: 0,
    left: 9,
    down: 18,
    right: 27,
    walkUp: [1, 8],
    walkLeft: [10, 17],
    walkDown: [19, 26],
    walkRight: [28, 35],
  };

  // set the elfs frame rate
  elf.fps = 12;

  // setup the keyboard keys
  leftArrow = keyboard(37);
  rightArrow = keyboard(39);
  upArrow = keyboard(38);
  downArrow = keyboard(40);

  // define the press method for each key
  leftArrow.press = () => {
    // play the elf's walkLeft animation sequence
    elf.playSequence(elf.states.walkLeft);
    elf.vx = -1;
    elf.vy = 0;
    console.log(elf.states.walkLeft);
  };
  leftArrow.release = () => {
    elf.show(elf.states.left);
    elf.vx = 0;
    elf.vy = 0;
  };

  rightArrow.press = () => {
    elf.playSequence(elf.states.walkRight);
    elf.vx = 1;
    elf.vy = 0;
    console.log(elf.states.walkRight);
  };
  rightArrow.release = () => {
    elf.show(elf.states.right);
    elf.vx = 0;
  };

  upArrow.press = () => {
    elf.playSequence(elf.states.walkUp);
    elf.vy = -1;
    elf.vx = 0;
    console.log(elf.states.walkUp);
  };
  upArrow.release = () => {
    elf.show(elf.states.up);
    elf.vy = 0;
    elf.vx = 0;
  };

  downArrow.press = () => {
    elf.playSequence(elf.states.walkDown);
    elf.vy = 1;
    elf.vx = 0;
    console.log(elf.states.walkDown);
  };
  downArrow.release = () => {
    elf.show(elf.states.down);
    elf.vy = 0;
    elf.vx = 0;
  };

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  // move the elf
  elf.x += elf.vx;
  elf.y += elf.vy;

  // keep the elf on the stage
  let edges = contain(elf, stage.localBounds);

  render(canvas);
}
