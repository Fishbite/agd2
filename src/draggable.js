// import functions and sprites that we need
import {
  makeCanvas,
  stage,
  draggableSprites,
  sprite,
  render,
} from "../lib/importer.js";

// import the asset loader
import { assets } from "../lib/assets.js";

// import the makePointer function
import { makePointer } from "../lib/interactive.js";

// load the texture atlas containing the animal sprites
assets.load(["../images/animals.json"]).then(() => setup());

// variables shared between functions
let canvas, cat, tiger, hedgehog, pointer;

function setup() {
  // make the canvas and intit the stage
  canvas = makeCanvas(256, 256);
  stage.width = canvas.width;
  stage.height = canvas.height;

  // make the three animal sprites
  cat = sprite(assets["cat.png"]);
  cat.width = canvas.width / 5;
  cat.height = cat.width;
  stage.putCenter(cat, 0, -32);
  cat.draggable = true;

  tiger = sprite(assets["tiger.png"]);
  tiger.width = canvas.width / 5;
  tiger.height = tiger.width;
  stage.putCenter(tiger, 32, 32);
  tiger.draggable = true;

  hedgehog = sprite(assets["hedgehog.png"]);
  hedgehog.width = canvas.width / 5;
  hedgehog.height = hedgehog.width;
  stage.putCenter(hedgehog, -32, 32);
  hedgehog.draggable = true;

  // make the pointer
  pointer = makePointer(canvas);

  //   console.log("cat.png:", cat);
  //   console.log("draggableSprites array:", draggableSprites);
  //   console.log("makePointer function:", makePointer);

  // start the game loop
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  // update the pointer's drag & drop system
  pointer.updateDragAndDrop(draggableSprites);

  render(canvas);
}
