/*
 ****** Simple Keyframe Use ******
    This program uses images from a
    tilset that diplay an elf sprite
    in a static position.

    i.e. facing up, right, left or down

    See keyframeAni.js for a program that
    uses tileset images for animation.

    e.g. to animate a walking sequence
 */

// ****** Import stuff we need ****** \\
import { assets } from "../lib/assets.js";

import {
  makeCanvas,
  stage,
  render,
  frames,
  sprite,
  draggableSprites,
} from "../lib/importer.js";

import { makePointer, keyboard } from "../lib/interactive.js";

import { contain } from "../lib/utils.js";

// states.png is a tileset of four elf images
assets.load(["../images/states.png"]).then(() => setup());

/*
 ****** Vars Shared Between Functions ******
 */

let canvas, elf, pointer, leftArrow, rightArrow, upArrow, downArrow;

// ****** Set Everthing Up ****** \\
// basically set up the sprites
function setup() {
  // set up the canvass and stage
  canvas = makeCanvas(512, 512, "4px solid darkred", "goldenrod");

  stage.width = canvas.width;
  stage.height = canvas.height;

  // create an array of frames, one for each
  // of the four images in the tileset
  let elfFrames = frames(
    assets["../images/states.png"], // the tileset being used
    [
      // An array of x/y positions of each image frame
      [0, 0],
      [0, 64],
      [0, 128],
      [0, 192],
    ], // Note: the tileset is a colummn of images, not a row
    64, // width of each frame
    64 // height of each frame
  );

  // create an elf sprite from elfFrames
  elf = sprite(elfFrames);
  elf.draggable = true; // Bonus!! Not required!
  stage.putCenter(elf);

  // Define four state properties of the elf
  // up, left, right and down
  elf.states = {
    up: 0,
    left: 1,
    down: 2,
    right: 3,
  };

  // setup some keyboard keys
  leftArrow = keyboard(37);
  rightArrow = keyboard(39);
  upArrow = keyboard(38);
  downArrow = keyboard(40);

  // define the press method for each key
  // use gotoAndStop to display the state
  leftArrow.press = () => {
    elf.gotoAndStop(elf.states.left);
    elf.vx = -1;
  };
  rightArrow.press = () => {
    elf.gotoAndStop(elf.states.right);
    elf.vx = 1;
  };
  upArrow.press = () => {
    elf.gotoAndStop(elf.states.up);
    elf.vy = -1;
  };
  downArrow.press = () => {
    elf.gotoAndStop(elf.states.down);
    elf.vy = 1;
  };

  leftArrow.release = () => {
    elf.vx = 0;
  };
  rightArrow.release = () => {
    elf.vx = 0;
  };

  upArrow.release = () => {
    elf.vy = 0;
  };
  downArrow.release = () => {
    elf.vy = 0;
  };

  // Bonus! Not required for keyframe ani'
  // but it allows us todrag the elf around
  pointer = makePointer(canvas);

  gameLoop();
}

// ****** Animate everything ****** \\
function gameLoop() {
  requestAnimationFrame(gameLoop);

  // update the sprite's drag and drop system
  pointer.updateDragAndDrop(draggableSprites);

  // move the elf
  elf.x += elf.vx * 5;
  elf.y += elf.vy * 5;

  // contain the elf within the stage boundries
  let edges = contain(elf, stage.localBounds);

  render(canvas);
}
