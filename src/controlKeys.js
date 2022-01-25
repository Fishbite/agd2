console.log("OK! Good to go!");

// Import some helpful function and objects
import {
  makeCanvas, // function to create canvas
  stage, // The root parent sprite
  render, // draw all sprites on the canvas
  rectangle, // Function to create a rectangle sprtie
  // group, // Function to groups sprites into a single named sprite
  buttons, // an array to store interactive buttons
} from "../lib/importer.js";

// Function to add touch events and event handlers
import { makePointer } from "../lib/interactiveStu.js";

// variabless shared between functions
let canvas, forBtn, tank, pointer;

setup();
function setup() {
  // Make the canvas
  canvas = makeCanvas(512, 256, "4px solid red", "goldenrod");
  // setup the root parent sprite
  stage.width = canvas.width;
  stage.height = canvas.height;

  //** Tank **/
  // create the tank components
  tank = rectangle(64, 48, "red");
  // place the tank at the center of the stage sprite
  stage.putCenter(tank);

  //** Controls */
  // create a rectangle to use as a button
  forBtn = rectangle(48, 32, "blue");
  // set its `interactive` property to true which adds it
  // to the `buttons` array so it can be updated each frame
  forBtn.interactive = true;

  // define the buttons `press` & `release` methods of the button
  let pressed;
  let released;
  forBtn.press = () => {
    tank.moveForward = true;
    pressed = Date.now();
    console.log("touchstart fired");
    console.log("Forward", Date.now());
  };
  forBtn.release = () => {
    tank.moveForward = false;
    console.log("touchend fired");
    console.log("Stop", Date.now());
    released = Date.now();
    console.log(`forBtn was pressed for ${released - pressed}ms`);
  };

  // add the mouse and touch events
  pointer = makePointer(canvas);

  // test if the pointer touches the button
  pointer.hitTestSprite(forBtn);

  // run the game loop
  gameLoop();
}

function gameLoop() {
  // repaint at the refresh rate of the screen
  requestAnimationFrame(gameLoop);

  // Move the tank forward if moveForward is true
  if (tank.moveForward) {
    tank.x += 0.3;
  }

  // update the interactive button
  forBtn.update(pointer, canvas);

  // if (buttons.length > 0) {
  //   canvas.style.cursor = "auto";
  //   buttons.forEach((button) => {
  //     button.update(pointer, canvas);
  //   });
  // }

  // loop through all the children of the stage object
  // and draw them in their current state / position
  render(canvas);
}
