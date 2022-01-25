console.log("Go! Go! Go!");

// Return: an array of approximately evenly spaced points along a cubic Bezier curve
//
// Attribution: Stackoverflow's @Blindman67
// Cite: http://stackoverflow.com/questions/36637211/drawing-a-curved-line-in-css-or-canvas-
//and-moving-circle-along-it/36827074#36827074
// As modified from the above citation
//
// ptCount: sample this many points at interval along the curve
// pxTolerance: approximate spacing allowed between points
// Ax,Ay,Bx,By,Cx,Cy,Dx,Dy: control points defining the curve
//
function plotCBez(ptCount, pxTolerance, Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
  var deltaBAx = Bx - Ax;
  var deltaCBx = Cx - Bx;
  var deltaDCx = Dx - Cx;
  var deltaBAy = By - Ay;
  var deltaCBy = Cy - By;
  var deltaDCy = Dy - Cy;
  var ax, ay, bx, by;
  var lastX = -10000;
  var lastY = -10000;
  var pts = [{ x: Ax, y: Ay }];
  for (var i = 1; i < ptCount; i++) {
    var t = i / ptCount;
    ax = Ax + deltaBAx * t;
    bx = Bx + deltaCBx * t;
    cx = Cx + deltaDCx * t;
    ax += (bx - ax) * t;
    bx += (cx - bx) * t;
    //
    ay = Ay + deltaBAy * t;
    by = By + deltaCBy * t;
    cy = Cy + deltaDCy * t;
    ay += (by - ay) * t;
    by += (cy - by) * t;
    var x = ax + (bx - ax) * t;
    var y = ay + (by - ay) * t;
    var dx = x - lastX;
    var dy = y - lastY;
    if (dx * dx + dy * dy > pxTolerance) {
      pts.push({ x: x, y: y });
      lastX = x;
      lastY = y;
    }
  }
  pts.push({ x: Dx, y: Dy });
  return pts;
}

// Return: an array of approximately evenly spaced points along a Quadratic curve
//
// Attribution: Stackoverflow's @Blindman67
// Cite: http://stackoverflow.com/questions/36637211/drawing-a-curved-line-in-css-or-canvas-
//and-moving-circle-along-it/36827074#36827074
// As modified from the above citation
//
// ptCount: sample this many points at interval along the curve
// pxTolerance: approximate spacing allowed between points
// Ax,Ay,Bx,By,Cx,Cy: control points defining the curve
//
function plotQBez(ptCount, pxTolerance, Ax, Ay, Bx, By, Cx, Cy) {
  var deltaBAx = Bx - Ax;
  var deltaCBx = Cx - Bx;
  var deltaBAy = By - Ay;
  var deltaCBy = Cy - By;
  var ax, ay;
  var lastX = -10000;
  var lastY = -10000;
  var pts = [{ x: Ax, y: Ay }];
  for (var i = 1; i < ptCount; i++) {
    var t = i / ptCount;
    ax = Ax + deltaBAx * t;
    ay = Ay + deltaBAy * t;
    var x = ax + (Bx + deltaCBx * t - ax) * t;
    var y = ay + (By + deltaCBy * t - ay) * t;
    var dx = x - lastX;
    var dy = y - lastY;
    if (dx * dx + dy * dy > pxTolerance) {
      pts.push({ x: x, y: y });
      lastX = x;
      lastY = y;
    }
  }
  pts.push({ x: Cx, y: Cy });
  return pts;
}

// Return: an array of approximately evenly spaced points along a line
//
// pxTolerance: approximate spacing allowed between points
// Ax,Ay,Bx,By: end points defining the line
//
function plotLine(pxTolerance, Ax, Ay, Bx, By) {
  var dx = Bx - Ax;
  var dy = By - Ay;
  var ptCount = parseInt(Math.sqrt(dx * dx + dy * dy)) * 3;
  var lastX = -10000;
  var lastY = -10000;
  var pts = [{ x: Ax, y: Ay }];
  for (var i = 1; i <= ptCount; i++) {
    var t = i / ptCount;
    var x = Ax + dx * t;
    var y = Ay + dy * t;
    var dx1 = x - lastX;
    var dy1 = y - lastY;
    if (dx1 * dx1 + dy1 * dy1 > pxTolerance) {
      pts.push({ x: x, y: y });
      lastX = x;
      lastY = y;
    }
  }
  pts.push({ x: Bx, y: By });
  return pts;
}

// Modify the Canvas' Context to calculate a set of approximately
// evenly spaced waypoints as it draws path(s).
function plotPathCommands(ctx, sampleCount, pointSpacing) {
  ctx.mySampleCount = sampleCount;
  ctx.myPointSpacing = pointSpacing;
  ctx.myTolerance = pointSpacing * pointSpacing;
  ctx.myBeginPath = ctx.beginPath;
  ctx.myMoveTo = ctx.moveTo;
  ctx.myLineTo = ctx.lineTo;
  ctx.myQuadraticCurveTo = ctx.quadraticCurveTo;
  ctx.myBezierCurveTo = ctx.bezierCurveTo;
  // don't use myPathPoints[] directly -- use "ctx.getPathPoints"
  ctx.myPathPoints = [];
  ctx.beginPath = function () {
    this.myLastX = 0;
    this.myLastY = 0;
    this.myBeginPath();
  };
  ctx.moveTo = function (x, y) {
    this.myLastX = x;
    this.myLastY = y;
    this.myMoveTo(x, y);
  };
  ctx.lineTo = function (x, y) {
    var pts = plotLine(this.myTolerance, this.myLastX, this.myLastY, x, y);
    Array.prototype.push.apply(this.myPathPoints, pts);
    this.myLastX = x;
    this.myLastY = y;
    this.myLineTo(x, y);
  };
  ctx.quadraticCurveTo = function (x0, y0, x1, y1) {
    var pts = plotQBez(
      this.mySampleCount,
      this.myTolerance,
      this.myLastX,
      this.myLastY,
      x0,
      y0,
      x1,
      y1
    );
    Array.prototype.push.apply(this.myPathPoints, pts);
    this.myLastX = x1;
    this.myLastY = y1;
    this.myQuadraticCurveTo(x0, y0, x1, y1);
  };
  ctx.bezierCurveTo = function (x0, y0, x1, y1, x2, y2) {
    var pts = plotCBez(
      this.mySampleCount,
      this.myTolerance,
      this.myLastX,
      this.myLastY,
      x0,
      y0,
      x1,
      y1,
      x2,
      y2
    );
    Array.prototype.push.apply(this.myPathPoints, pts);
    this.myLastX = x2;
    this.myLastY = y2;
    this.myBezierCurveTo(x0, y0, x1, y1, x2, y2);
  };
  ctx.getPathPoints = function () {
    return this.myPathPoints.slice();
  };
  ctx.clearPathPoints = function () {
    this.myPathPoints.length = 0;
  };
  ctx.stopPlottingPathCommands = function () {
    if (!this.myBeginPath) {
      return;
    }
    this.beginPath = this.myBeginPath;
    this.moveTo = this.myMoveTo;
    this.lineTo = this.myLineTo;
    this.quadraticCurveto = this.myQuadraticCurveTo;
    this.bezierCurveTo = this.myBezierCurveTo;
    this.myBeginPath = undefined;
  };
}
// Path related variables
var A = { x: 50, y: 100 };
var B = { x: 125, y: 25 };
var BB = { x: 150, y: 15 };
var BB2 = { x: 150, y: 185 };
var C = { x: 175, y: 200 };
var D = { x: 300, y: 150 };
var n = 1000;
var tolerance = 1.5;
var pts;
// canvas related variables
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 378;
canvas.height = 256;
// Tell the Context to plot waypoint in addition to
// drawing the path
plotPathCommands(ctx, n, tolerance);
// Path drawing commands
ctx.beginPath();
ctx.moveTo(A.x, A.y);
ctx.bezierCurveTo(B.x, B.y, C.x, C.y, D.x, D.y);
ctx.quadraticCurveTo(BB.x, BB.y, A.x, A.y);
ctx.lineTo(D.x, D.y);
ctx.strokeStyle = "gray";
ctx.stroke();
// Tell the Context to stop plotting waypoints
ctx.stopPlottingPathCommands();
// Incrementally draw the path using the plotted points
ptsToRects(ctx.getPathPoints());
function ptsToRects(pts) {
  ctx.fillStyle = "red";
  var i = 0;
  requestAnimationFrame(animate);
  function animate() {
    ctx.fillRect(pts[i].x - 0.5, pts[i].y - 0.5, tolerance, tolerance);
    i++;
    if (i < pts.length) {
      requestAnimationFrame(animate);
    }
  }
}
