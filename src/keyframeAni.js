console.log("All cool and we're good to go :o)");

import { assets } from "../lib/assets.js";

import { makeCanvas, stage, render, sprite } from "../lib/importer.js";

import { keyboard } from "../lib/interactive.js";

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

function addStatePlayer(sprite) {
  // variables
  let frameCounter = 0,
    numberOfFrames = 0,
    startFrame = 0,
    endFrame = 0,
    timerInterval = undefined;

  // Display static states with the show function
  function show(frameNumber) {
    // reset any animations previously started
    reset();

    // find the new state on the sprite
    sprite.gotoAndStop(frameNumber);
  }

  // play all the sprite's frames with this function
  function play() {
    playSequence([0, sprite.frames.length - 1]);
  }

  // stop the animation at its current frame
  function stop() {
    reset();
    sprite.gotoAndStop(sprite.currentFrame);
  }

  // play a pre-defined sequence of frames.
  // poperties of sprite.states object
  // e.g. walkUp: [1, 8]
  function playSequence(sequenceArray) {
    // reset previous animations
    reset();

    // calculate the number of frames in the range
    startFrame = sequenceArray[0];
    endFrame = sequenceArray[1];
    numberOfFrames = endFrame - startFrame;

    // compensate for two edge cases
    // 1. startFrame is 0
    if (startFrame === 0) {
      numberOfFrames++;
      frameCounter++;
    }

    // 2. a two frame sequence is provided
    if (numberOfFrames === 1) {
      numberOfFrames = 2;
      frameCounter++;
    }

    // calculate the frame rate. Set default to 12fps
    if (!sprite.fps) sprite.fps = 12;
    let frameRate = 1000 / sprite.fps;

    // set the sprite to the starting frame
    sprite.gotoAndStop(startFrame);

    // if the sprite isn't already playing, start it
    if (!sprite.playing) {
      timerInterval = setInterval(advanceFrame.bind(this), frameRate);
      sprite.playing = true;
    }
  }

  // function called by setInterval to display the next frame
  // in the sequence based on the frameRate. When the frame
  // sequence reaches the end it will either stop or loop
  function advanceFrame() {
    // advance the frame if the frameCounter is less than
    // the states total frames
    if (frameCounter < numberOfFrames) {
      // goto the next frame
      sprite.gotoAndStop(sprite.currentFrame + 1);

      // update the frame counter
      frameCounter += 1;

      // start from the first frame again if we
      // have reached the end and loop is true
    } else {
      if (sprite.loop) {
        sprite.gotoAndStop(startFrame);
        frameCounter = 1;
      }
    }
  }

  function reset() {
    // reset sprite.playing to false and frameCounter to 0
    if (timerInterval !== undefined && sprite.playing === true) {
      sprite.playing = false;
      frameCounter = 0;
      startFrame = 0;
      endFrame = 0;
      numberOfFrames = 0;
      // clear the timerInterval
      clearInterval(timerInterval);
    }
  }

  // add the methods to the sprite
  sprite.show = show;
  sprite.play = play;
  sprite.stop = stop;
  sprite.playSequence = playSequence;
}