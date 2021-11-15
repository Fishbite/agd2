// This is a test file used to aske questions about
// missing width & height params from Adobe Illustrator files
// and missing opacity masks when rendering on html canvas
function makeCanvas(
  width = 256,
  height = 256,
  border = "1px solid black",
  backgroundColor = "white"
) {
  // make the canvas element and add it to the DOM
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = border;
  canvas.style.backgroundColor = backgroundColor;
  document.body.appendChild(canvas);
  canvas.ctx = canvas.getContext("2d");

  // return the canvas
  return canvas;
}
let canvas = makeCanvas(512, 512);
let ctx = canvas.getContext("2d");

let test = new Image();
test.addEventListener("load", loadHandler, false);
test.src = "../images/tourlitislighthouse03.svg";
// test.width = canvas.width;
test.height = canvas.height / 4;
console.log(test);

function loadHandler() {
  ctx.drawImage(test, -0, -0);
}

// function loadHandler() {
//   // set line style options
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 3;

//   // draw a rectangle
//   ctx.beginPath();
//   ctx.rect(64, 64, 128, 128);

//   // set the pattern to the image and the fillstyle to the pattern

//   let pattern = ctx.createPattern(test, "no-repeat");
//   ctx.fillStyle = pattern;

//   // offset the canvas to match the rectangle x/y coord
//   // then start the image fill from that point
//   ctx.save();
//   ctx.translate(64, 64);
//   ctx.stroke();
//   ctx.fill();
//   ctx.restore();
// }
