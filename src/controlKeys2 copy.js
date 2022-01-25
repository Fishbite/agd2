/*
setup function:
make the canvas
create 2 sprites button and player
add event listeners

gameLoop:
make the player sprite move
refresh the screen / repaint the canvas

*/

function addTouchEvents(e) {
  canvas.addEventListener("touchstart", handleStart, { passive: false });
  canvas.addEventListener("touchend", handleEnd, { passive: false });
  //   canvas.addEventListener("touchcancel", handleCancel, { passive: false });
  //   canvas.addEventListener("touchleave", handleLeave, { passive: false });
  //   canvas.addEventListener("touchmove", handleMove, { passive: false });
}

// event handlers
function handleStart(e) {
  e.preventDefault();
  let log = document.getElementById("log");
  log.innerText = "touchstart";
  console.log("touchstart");
  player.move = true;
}
function handleEnd(e) {
  e.preventDefault();
  let log = document.getElementById("log");
  log.innerText = "touchend";
  console.log("touchend");

  player.move = false;
}
// function handleCancel(e) {
//   e.preventDefault();
//   let log = document.getElementById("log");
//   log.innerText = "touchcancel";
//   console.log("touchcancel");
// }
// function handleLeave(e) {
//   e.preventDefault();
//   let log = document.getElementById("log");
//   log.innerText = "touchleave";
//   console.log("touchleave");
// }
// function handleMove(e) {
//   e.preventDefault();
//   let log = document.getElementById("log");
//   log.innerText = "touchmove";
//   console.log("touchmove");
// }

// function to creaate rectangle sprites
function rectangle(
  width = 64,
  height = 64,
  fillStyle = "grey",
  strokeStyle = "none",
  lineWidth = 0,
  x = 0,
  y = 0
) {
  // assign the function's args to an object called 'o'
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

  // return sprite position and size
  o.localBounds = { x, y, width, height };

  // the rectangle's own render method
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

  children.push(o);

  return o;
}

// a render function to loop through all the objects in the
// `children` array and use the objects own render function.
function render(canvas, ctx) {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // loop through each sprite object in the `children` array
  children.forEach((sprite) => {
    displaySprite(sprite);
  });

  function displaySprite(sprite) {
    if (sprite.visible) {
      ctx.save();

      ctx.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);

      // use the sprite's own render method
      sprite.render(ctx);

      // restore the canvas to its former state
      ctx.restore();
    }
  }
}

let canvas,
  ctx,
  player,
  children = [];

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

  addTouchEvents();

  // set the styles for the player
  ctx.strokeStyle = "darkgrey";
  ctx.lineWidth = 2;
  ctx.fillStyle = "darkred";

  // create the player
  player = rectangle(
    64,
    64,
    "darkblue",
    "darkgrey",
    4,
    canvas.width / 4 - 32,
    canvas.height / 2 - 32
  );

  player.vx = 0;
  player.acceleration = 0.025;

  renderLoop();
}

function renderLoop() {
  requestAnimationFrame(renderLoop);

  if (player.move) {
    player.vx += player.acceleration;
    player.x += player.vx;
  } else {
    player.vx = 0;
  }

  // set the player position so that it appears from the left hand
  // side of the canvas after it has left the right hand side
  if (player.x > canvas.width) {
    player.x = -player.width;
  }

  render(canvas, ctx);
}
