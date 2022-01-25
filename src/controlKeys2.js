// function to add touch event listeners
function addTouchEvents(e) {
  canvas.addEventListener("touchstart", handleStart, { passive: false });
  canvas.addEventListener("touchend", handleEnd, { passive: false });

  btn.addEventListener("touchstart", handleStart, { passive: false });
  btn.addEventListener("touchend", handleEnd, { passive: false });
}

// the event handlers
function handleStart(e) {
  e.preventDefault();
  // get the <p> element
  let log = document.getElementById("log");
  // write to the <p> element
  log.innerText = `${e.target}`;
  // write to the console
  console.log(`${e.type}`);

  // set the player's `move` property
  player.move = true;
}
function handleEnd(e) {
  e.preventDefault();
  let log = document.getElementById("log");
  log.innerText = `${e.type}`;
  console.log(`${e.type}`);

  // set the player's move property
  player.move = false;
}

// function to creaate rectangle sprites with default param's
function rectangle(
  width = 64, // sprite width
  height = 64, // sprite height
  fillStyle = "grey", // fill color
  strokeStyle = "none", // line color
  lineWidth = 0, // line width
  x = 0, // the sprite's x position
  y = 0 // the sprite's y position
) {
  // create an object called 'o' for the function to return and
  // assign the function's args to the object
  let o = {};
  Object.assign(o, {
    width,
    height,
    fillStyle,
    strokeStyle,
    lineWidth,
    x,
    y,
  });

  // should the sprite be rendered
  o.visible = true;

  // velocity vectors
  o.vx = 0;
  o.vy = 0;

  // return an object with the sprite position and size
  o.localBounds = { x, y, width, height };

  // the rectangle's own render method
  // draws the sprite using the canvas contexts2d commands
  o.render = (ctx) => {
    // setup the styles
    ctx.strokeStyle = o.strokeStyle;
    ctx.fillStyle = o.fillStyle;
    ctx.lineWidth = o.lineWidth;
    // draw the shape
    ctx.beginPath();
    ctx.rect(-o.width / 2, -o.height / 2, o.width, o.height);
    if (o.strokeStyle !== "none") {
      ctx.stroke();
    }
    if (o.fillStyle !== "none") {
      ctx.fill();
    }
  };

  // push the sprite onto the children array so that
  // we can loop through each object and render each to the screen
  children.push(o);

  // return the object
  return o;
}

// a render function to loop through all the objects in the
// `children` array and use the objects own render function.
function render(canvas, ctx) {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // loop through each sprite object in the `children` array
  children.forEach((sprite) => {
    displaySprite(sprite); // run the `displaySprite` function
  });

  function displaySprite(sprite) {
    // check if the sprite's `visible` property is set to `true`
    if (sprite.visible) {
      ctx.save();

      // move the canvas context2d ready to draw the sprite
      ctx.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);

      // use the sprite's own render method
      sprite.render(ctx);

      // restore the canvas to its former state
      ctx.restore();
    }
  }
}

// variables shared between functions
let btn,
  canvas,
  ctx,
  player,
  children = [];

// function to set up the game area and sprites
setup();
function setup() {
  // Create the canvas
  canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  canvas.style.border = "4px solid black";
  canvas.style.backgroundColor = "grey";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // get the html button
  btn = document.getElementById("btn");

  // run the function to add touch event listeners
  addTouchEvents();

  // create the player
  player = rectangle(
    64, // width
    64, // height
    "darkblue", // fill color
    "darkgrey", // line color
    4, // line width
    canvas.width / 4 - 32, // sprite's X position
    canvas.height / 2 - 32 // sprite's Y position
  );

  // define some props to help move the sprite
  player.vx = 0; // velocity
  player.acceleration = 0.025; // acceleration

  // call the animation loop
  renderLoop();
}

// the animation loop
function renderLoop() {
  requestAnimationFrame(renderLoop);

  // game logics
  if (player.move) {
    player.vx += player.acceleration;
    player.x += player.vx;
  } else {
    player.vx = 0;
  }

  // move the player back to the left of the game area
  // when it disappears on the right
  if (player.x > canvas.width) {
    player.x = -player.width;
  }

  // call the render function to loop through all the objects
  // in the `children` array
  render(canvas, ctx);
}
