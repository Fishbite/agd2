console.log(window.innerWidth);

import {
  makeCanvas,
  stage,
  render,
  rectangle,
  line,
  circle,
  arc,
  text,
  curvedText,
  sprite,
  group,
  quadCurve,
  bezCurve,
} from "../lib/importer.js";

import { assets } from "../lib/assets.js";

import { contain, randomInt } from "../lib/utils.js";

assets
  .load([
    "../fonts/puzzler.otf",
    // "../images/cat.png",
    "../images/Text_SeaOfYourNicheCropped.png",
    "../images/lighthouse01.png",
    // "../images/anglustext.png",
    // "../images/anglustext-56pt.png",
    "../images/anglustext-circular.png",
    // "../images/AnglusTeamWithIris.png",
    "../images/supernova.png",
  ])
  .then(() => setup());

// Variables
let canvas,
  screenWidth = window.innerWidth,
  screenHeight = window.innerHeight,
  anglusText,
  bez1,
  bez2,
  bridge,
  bridgeAx,
  bridgeBx,
  bridgeAy,
  bridgeBy,
  bridgeVx,
  bridgeDiagonal,
  bridgeCurve,
  column1,
  column2,
  cp1Txt,
  cp2Txt,
  cp1,
  cp2,
  cp3,
  cp4,
  ep1,
  ep2,
  leftEye,
  rightEye,
  sea,
  seaOYN,
  sand,
  supernova,
  waves = [],
  waves2 = [],
  winArr = [];

/*
window.addEventListener("resize", createCanvas, false);

function createCanvas() {
  if (screenWidth > screenHeight) {
    canvas = makeCanvas(screenWidth, screenHeight);
  } else {
    canvas = makeCanvas(screenWidth, screenWidth * 0.75);
  }

  return canvas;
}
createCanvas();
*/

function setup() {
  // determine the size of the canvas
  let screenMinSize = Math.min(screenWidth, screenHeight);
  console.log("screenMinSize:", screenMinSize, screenWidth);

  // set up the canvas and stage sprite
  canvas = makeCanvas(
    screenWidth - 40,
    screenMinSize - 8,
    "4px solid orange",
    "black"
  );
  stage.width = canvas.width;
  stage.height = canvas.height;

  // position the canvas on screen
  let margin = (screenWidth - canvas.width - 8) / 2;
  console.log("margin:", margin);
  canvas.style.padding = 0;
  document.body.style.overflow = "hidden";

  canvas.style.marginLeft = `${margin}px`;
  canvas.style.marginRight = `${margin}px`;

  // ****** Start Create Some Text ****** \\
  let content = "Prototype";
  let message = text(content, "32px puzzler", "lightgrey", 8, 8);

  // WARNING: This Could Fry Your Processor!!!!
  // Keep your ears on your CPU fan
  // let curvedMsg = curvedText(
  //   "Sea of Your Niche",
  //   "24px Arial",
  //   "red",
  //   stage.halfWidth / 2, // shouldn't have to do this!
  //   stage.halfHeight / 2,
  //   75,
  //   Math.PI * 1.5
  // );

  // curvedMsg.layer = 10;
  // curvedMsg.rotation = -0.08; // Hack to set the ends level
  // console.log("curvedMsg layer:", curvedMsg.layer);

  // console.log("curvedMsg X:", curvedMsg.x);
  // ****** End Create Some Text ****** \\

  /* ***** Start Create Two Columns ****** */
  // vars to dictate the column sizes
  let columnHeight = stage.height * 0.5;
  let columnWidth = columnHeight * 0.2;

  // convenience var to help position the sea
  let columnBottom = columnHeight + (stage.height - columnHeight) / 2;
  // position var for the columns
  // this is the offset from the center of the stage
  let columnPos = (stage.width * 0.75) / 2;
  console.log("columnPos:", columnPos);

  column1 = rectangle(
    columnWidth,
    columnHeight,
    "none",
    "rgb(120, 100, 80)",
    1
  );
  stage.putCenter(column1, -columnPos);

  column1.visible = true;

  column2 = rectangle(
    columnWidth,
    columnHeight,
    "none",
    "rgb(120, 100, 80)",
    1
  );
  stage.putCenter(column2, columnPos);

  /* ***** End Create Two Columns ****** */

  // ****** Start Customer Windows ****** \\
  let windowSize = columnWidth / 4;
  let windowGap = 8;

  // number of windows to tile vertically with 2px space around
  let numWindows = Math.floor(columnHeight / (windowSize + windowGap));

  // create the windows for the array
  for (let i = 0; i <= numWindows; i++) {
    winArr[i] = rectangle(columnWidth / 3, columnWidth / 4);
    winArr[i].fillStyle = "rgba(140, 140, 155, 1)";
    winArr[i].strokeStyle = "rgb(40, 40, 55)";
    winArr[i].visible = false;
  }

  // position the first window
  column2.putTop(winArr[0], 0, windowSize + windowGap);
  winArr[0].visible = true;

  // position each subsequent window below the last
  for (let i = 1; i < numWindows - 1; i++) {
    winArr[i - 1].putBottom(winArr[i], 0, windowGap);
    winArr[i].visible = true;
  }
  console.log("How many windows:", numWindows - 1);
  // ****** Ends Customer Windows ******\\

  // ****** Start Lighthouse ****** \\
  let lighthouse;
  // lighthouse = sprite(assets["../images/lighthouse01.png"]);
  lighthouse = sprite(assets["../images/lighthouse01.png"]);
  lighthouse.width = columnWidth;
  lighthouse.height = columnHeight;
  stage.putCenter(lighthouse, -columnPos);
  // ****** End Lighthouse ****** \\

  /* ****** START masking to create the sea waves ****** */
  // a transparent circle to cut out a
  // bit of a rectangle
  let waveSize = screenWidth / 8;

  // rectangles to mask
  let rects = [];
  // loop to do the masking
  for (let i = 0; i < 8; i++) {
    // make the waves in this loop
    waves[i] = circle(waveSize, "rgba(0, 0, 0, 0)"); // transparent circle
    waves[i].mask = true; // sprite will act mask other sprites / images
    rects[i] = rectangle(waveSize, 8, "rgba(173, 216, 230, 0.5)"); // lightblue + transparency
    waves[i].addChild(rects[i]); // add rectangle as child of circle so circle masks child
  }

  // position the first wave
  column1.putBottom(waves[0], 0, -8); // put the first wave at the bottom of the left column

  // position each subsequent wave to the right of the previous
  for (let i = 1; i < waves.length; i++) {
    waves[i - 1].putRight(waves[i]);
  }

  // make a second set of waves and repeat the above
  let rects2 = [];
  for (let i = 0; i < 32; i++) {
    // make the waves in this loop
    waves2[i] = circle(waveSize / 2, "rgba(0, 0, 0, 0)");
    waves2[i].mask = true;
    rects2[i] = rectangle(waveSize / 2, 8, "rgba(173, 216, 230, 0.5)");
    waves2[i].addChild(rects2[i]);
  }

  // position the first wave
  column1.putBottom(waves2[0], 0, -8);
  // position each wave to the right of the previous
  for (let i = 1; i < waves2.length; i++) {
    waves2[i - 1].putRight(waves2[i]);
  }

  sea = line("lightblue", 8, 0, columnBottom, screenWidth, columnBottom);
  sea.shadow = true;
  sea.shadowOffsetX = 0;
  /* ****** END masking to create the sea waves ****** */

  // mask an image
  /*
  let cMask = circle(64);
  cMask.mask = true;
  let cat = sprite(assets["../images/cat.png"]);
  cMask.addChild(cat);
  */

  //* ****** make the sea bed ****** *\\
  sand = line("goldenrod", 32, 0, 0, screenWidth, 0);
  stage.putBottom(sand, -stage.halfWidth, -16);

  /* ****** The Sea of Your Niche ****** */
  seaOYN = circle(stage.halfHeight - 48, "rgba(0, 0, 0, 1)");
  stage.putCenter(seaOYN);

  let seaText = sprite(assets["../images/Text_SeaOfYourNicheCropped.png"]);
  seaText.width = stage.halfHeight;
  seaText.height = stage.halfHeight;
  stage.putCenter(seaText);
  /* ****** The Sea of Your Niche End ****** */

  //* ****** Bridge Start ****** *\\
  // note: these are the start and end coords
  bridgeAx = stage.halfWidth - columnPos + column1.halfWidth - 2; // start x coord (- 2px space around png)
  bridgeBx = stage.halfWidth + columnPos - column2.halfWidth; // end x coord
  bridgeAy = stage.halfHeight * 1.25; // start y coord
  bridgeBy = stage.halfHeight * 1.25; // end y coord

  // speed of bridge traversal
  bridgeVx = (bridgeBx - bridgeAx) / 120; // 2 sec @ 60fps

  // note: start and end x coords are the same
  // the aniLoop takes care of bx for bridge.bx and bridgeDiagonal.bx
  bridge = line("grey", 4, bridgeAx, bridgeAy, bridgeAx, bridgeBy);
  bridgeDiagonal = line(
    "grey",
    1,
    bridgeAx,
    bridgeAy - column1.width,
    bridgeAx,
    bridgeAy
  );
  // bridge.layer = 0;

  bridgeCurve = quadCurve(
    "grey",
    "none",
    2,
    bridgeAx,
    bridgeAy,
    bridgeAx,
    bridgeAy - column1.width * 1.5,
    bridge.bx,
    bridgeBy
  );

  /* ****** Bridge End ****** */

  // ****** Start Supernova ****** \\
  supernova = sprite(assets["../images/supernova.png"]);
  supernova.width = stage.width;
  supernova.height = stage.height;
  stage.putCenter(supernova);
  supernova.alpha = 0;
  // ****** End Supernova ****** \\

  // ****** Start Anglus Text ****** \\
  anglusText = sprite(assets["../images/anglustext-circular.png"]);
  anglusText.scaleX = 0.9;
  anglusText.scaleY = 0.9;
  anglusText.alpha = 0;
  // anglusText.scaleX = 0;
  // anglusText.scaleY = 0;

  stage.putCenter(anglusText);
  // console.log(anglusText.width, anglusText.height);

  // ****** End Anglus Text ****** \\

  // ****** Start People ****** \\
  let face01 = circle(64, "none", "rgb(120, 100, 80)", 1);
  face01.scaleX = 0.75;
  leftEye = circle(12, "none", "rgb(120, 100, 80)", 1);
  face01.addChild(leftEye);
  face01.putCenter(leftEye, 14, -6);
  //eyes
  rightEye = circle(12, "none", "rgb(120, 100, 80)", 1);
  face01.addChild(rightEye);
  face01.putCenter(rightEye, -14, -6);
  // mouth
  let mouthL1 = line("rgb(120, 100, 80)", 1, 0, 0, 16, 0);
  let mouthL2 = line("rgb(120, 100, 80)", 1, 0, 0, -4, -4);
  let mouthL3 = line("rgb(120, 100, 80)", 1, 16, 0, 20, -4);

  let mouthGroup = group(mouthL1, mouthL2, mouthL3);
  face01.putCenter(mouthGroup, -8, 16);
  face01.addChild(mouthGroup);

  column1.putTop(face01);

  // ****** End People ****** \\

  // ****** Arc Test ****** \\
  let hair01 = arc(64, "rgba(0, 0, 255, 0.75)", "blue", 2, 3.14, 3.14 * 1.5);
  let hair02 = arc(64, "rgba(0, 0, 255, 0.75)", "blue", 2, 3.14, 3.14 * 1.5);
  hair02.rotation = 1.5;
  let hair = group(hair01, hair02);
  face01.putTop(hair, 0, hair.height);

  // ****** Quadratic Curve Test ****** \\
  let hair03 = quadCurve("none", "blue");
  // quad.closePath = true;
  face01.putTop(hair03, -face01.halfWidth, -16); // fails!!

  // Don't need to do this, just closeCurve
  let hatBase = line("rgb(70, 80, 90)", 2, 0, 32, 64, 32);
  // face01.putTop(hatBase);

  let hatCurve = quadCurve(
    "rgb(170, 180, 190)",
    "grey",
    2,
    hatBase.ax, // start x
    hatBase.ay, // start y
    hatBase.ax, // control point x
    hatBase.ay - 32, // control point y
    hatBase.bx, //end x
    hatBase.by // end y
  );

  let hat = group(hatBase, hatCurve);
  face01.putTop(hat, -24, -24);

  // new Arc sprite with anit-clockwise
  // and closeArc parameters
  let testArc = arc(
    64,
    "none",
    "grey",
    2,
    0,
    1.57,
    0,
    stage.halfHeight,
    true, // ACW?
    true // closeArc?
  );

  // test bezCurve
  let testBez = bezCurve("orange", "purple", 4);
  column2.putTop(testBez, -64, -32);

  // ****** Animated Bezier Curves ****** \\

  // bezier curve 1 to animate
  bez1 = bezCurve(
    "blue", // stroke
    "rgba(255, 100, 0, 0.25)", // fill
    1, // lineWidth
    0, //ax
    stage.halfHeight, // ay
    stage.halfWidth / 2, // cp1x
    stage.halfHeight / 2, // cp1Y
    stage.halfWidth / 2, // cp2x
    stage.halfHeight * 1.5, // cp2y
    stage.width, // bx
    stage.halfHeight, // by
    true
  );

  // bezier curve 2 to animate
  bez2 = bezCurve(
    "yellow", // stroke
    "rgba(255, 255, 0, 0.25)", // fill
    1, // lineWidth
    0, //ax
    stage.halfHeight, // ay
    stage.halfWidth / 2, // cp1x
    stage.halfHeight / 2, // cp1Y
    stage.halfWidth / 2, // cp2x
    stage.halfHeight * 1.5, // cp2y
    stage.width, // bx
    stage.halfHeight, // by
    true
  );

  // vars to show / hide control points
  // or rather; the bouncing balls
  // that the control points are attached to
  let controlPointsVisible = false;
  let endPointsVisible = true;

  // bouncing circle bez1
  cp1 = circle(8, "none", "blue", 4, bez1.cp1x, bez1.cp1y);
  // cp1Txt = text("cp1", "Ariel", "blue", cp1.x - 4, cp1.y - 14);
  cp1.visible = controlPointsVisible;

  // bouncing circle bez1
  cp2 = circle(8, "none", "black", 4, bez1.cp2x, bez1.cp2y);
  // cp2Txt = text("cp2", "Ariel", "black", cp2.x - 4, cp2.y - 14);
  cp2.visible = controlPointsVisible;

  // bouncing circle bez2
  cp3 = circle(8, "none", "orange", 4, bez2.cp1x, bez2.cp1y);
  // cp1Txt = text("cp1", "Ariel", "blue", cp1.x - 4, cp1.y - 14);
  cp3.visible = controlPointsVisible;

  // bouncing circle bez2
  cp4 = circle(8, "none", "red", 4, bez2.cp2x, bez2.cp2y);
  // cp2Txt = text("cp2", "Ariel", "black", cp2.x - 4, cp2.y - 14);
  cp4.visible = controlPointsVisible;

  // bouncing circle for curve end points
  ep1 = circle(8, "none", "purple", 4, 0, stage.halfHeight);
  ep1.visible = endPointsVisible;

  ep2 = circle(8, "none", "purple", 4, stage.width - 8, stage.halfHeight);
  ep2.visible = endPointsVisible;

  // bez1 control point velocities
  cp1.vx = randomInt(1, 5);
  cp1.vy = randomInt(1, 5);
  cp2.vx = randomInt(1, 5);
  cp2.vy = randomInt(1, 5);

  // bez2 control point velocities
  cp3.vx = randomInt(1, 5);
  cp3.vy = randomInt(1, 5);
  cp4.vx = randomInt(1, 5);
  cp4.vy = randomInt(1, 5);

  // end point velocities
  ep1.vx = randomInt(1, 3);
  ep1.vy = randomInt(1, 3);
  ep2.vx = randomInt(1, 3);
  ep2.vy = randomInt(1, 3);

  console.log("cp1", cp1);

  aniLoop();
}

// function randomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var to stop infinite running of for loop on column2 windows
// this has to be outside of the aniLoop() otherwise
// it is reset to original value every animation frame!
// let stopTheLoop = 0;
// let stopCount = 0;
// let eyeCount = 0;
// Above vars are now props in object `o` below:

// Object to hold animation counters rather than
// having global variables that could be overwitten
const o = {
  stopTheLoop: 0,
  stopCount: 0,
  eyeCount: 0,
};

function closeEye(eye) {
  eye.scaleY = 0.1;
  // console.log("closed");
}

function openEye(eye) {
  eye.scaleY = 1;
  // console.log("open");
}

function aniLoop() {
  requestAnimationFrame(aniLoop);

  /* **** running waves animation **** */
  let vx = 1; // velocity / vector

  for (let wave of waves) {
    wave.x += vx / 4; // set the wave movement speed

    // position the wave to the left of the stage when it goes off
    // the end of the canvas
    if (wave.x > stage.width) wave.x = -wave.width;
  }

  for (let wave of waves2) {
    wave.x += vx / 2;
    if (wave.x > stage.width) wave.x = -wave.width;
  }
  /* **** end running waves animation **** */

  /* ****** Start Bridge Ani ****** */
  // if the end of the bridge's x coord is less than it's
  // destination x coord minus 1px
  // add another bit to the length of the bridge
  // **** Note on Bridge timing **** \\
  // Need to calculate vx so that total time for bridge
  // transition is the same regardless of screen width.

  if (bridge.bx <= bridgeBx - 1) {
    bridge.bx += bridgeVx;
    bridgeDiagonal.bx = bridge.bx;
    bridgeCurve.bx = bridge.bx;
    bridgeCurve.cpx += bridgeVx / 2;
    bridgeCurve.cpy -= bridgeVx / 4;
  } else if (o.stopTheLoop === 0) {
    // change the fill colour when the bridge meets column2
    // column2.fillStyle = "rgba(0, 155, 0, 0.75)";
    for (let i = 0; i < winArr.length; i++) {
      winArr[i].fillStyle = "rgba(255, 255, 150, 1)";
      winArr[i].strokeStyle = "grey";
      o.stopTheLoop = 1; // stop this loop from running again
      // console.log("stopTheLoop:", o.stopTheLoop);
    }

    column2.lineWidth = 1;
  }
  /* ****** End Bridge Ani ****** */

  // ****** Start Supernova Fade In ****** \\
  if (supernova.alpha >= 1) {
    o.stopTheLoop = 2;
  } else if (o.stopTheLoop === 1 && supernova.alpha < 1) {
    supernova.alpha += 0.01;
    anglusText.alpha += 0.01;
    // console.log("supernova.alpha", supernova.alpha);
  }
  // ****** End Supernova Fade In ****** \\

  // ****** Start Anglus Text Fade In ****** \\
  if (
    supernova.alpha > 0.25 &&
    anglusText.scaleX < 1 &&
    anglusText.scaleY < 1
  ) {
    anglusText.scaleX += 0.001;
    anglusText.scaleY += 0.001;
    // anglusText.y -= 0.075;
  }
  // ****** End Anglus Text Fade In ****** \\

  // ****** People Ani ****** \\
  // Close both eyes then open eyes individually
  if (o.eyeCount === 0 && supernova.alpha >= 1) {
    closeEye(leftEye);
    closeEye(rightEye);
    // setTimeout(() => openEye(leftEye), 500);
    o.eyeCount = 1;
    setTimeout(() => {
      openEye(leftEye);
    }, 750);
    setTimeout(() => openEye(rightEye), 1250);
  }

  // ****** Bezier Curve Ani ****** \\
  /* bezCurve2 params:
    bezCurve(strokeStyle: any, fillStyle: any, lineWidth: any, ax: any, ay: any, cp1x: any, cp1y: any, cp2x: any, cp2y: any, bx: any, by: any, closeCurve:
  */

  // boundries to contain the control points
  let bounds = {
    x: 0 - stage.halfWidth,
    y: 0 - stage.halfHeight,
    width: stage.width + stage.halfWidth,
    height: stage.height + stage.halfHeight,
  };

  let collision1 = contain(cp1, bounds, true);
  let collision2 = contain(cp2, bounds, true);
  let collision3 = contain(cp3, bounds, true);
  let collision4 = contain(cp4, bounds, true);

  let collision5 = contain(ep1, stage.localBounds, true);
  let collision6 = contain(ep2, stage.localBounds, true);

  // if the end point (ep2) hits the top of the canvas
  // make the face close eyes then open each individually
  if (collision6 === "top") {
    closeEye(leftEye);
    closeEye(rightEye);
    setTimeout(() => {
      openEye(leftEye);
      openEye(rightEye);
    }, 250);
  }

  // set end point velcities
  ep1.x += ep1.vx;
  ep1.y += ep1.vy;

  ep2.x += ep2.vx;
  ep2.y += ep2.vy;

  // connect bez curve start point to ep1
  bez1.ax = ep1.x;
  bez1.ay = ep1.y;
  bez2.ax = ep1.x;
  bez2.ay = ep1.y;

  // connect curve end points to ep2
  bez1.bx = ep2.x;
  bez1.by = ep2.y;
  bez2.bx = ep2.x;
  bez2.by = ep2.y;

  // apply individual rand velocities to each
  // circle's x / y points to make them move
  cp1.x += cp1.vx;
  cp1.y += cp1.vy;

  cp2.x += cp2.vx;
  cp2.y += cp2.vy;

  cp3.x += -cp3.vx;
  cp3.y += -cp3.vy;

  cp4.x += -cp4.vx;
  cp4.y += -cp4.vy;

  // attach each bezier ctrl point to
  // a bouncing circle
  bez1.cp1x = cp1.x;
  bez1.cp1y = cp1.y;

  bez1.cp2x = cp2.x;
  bez1.cp2y = cp2.y;

  bez2.cp1x = cp3.x;
  bez2.cp1y = cp3.y;

  bez2.cp2x = cp4.x;
  bez2.cp2y = cp4.y;

  render(canvas);
}
