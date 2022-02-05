// import { makeCanvas } from "../lib/makeCanvas.js";

// let canvas = makeCanvas(512, 512);

/* ****** Import From This File ******
 `remove` to remove a sprite or list of sprites from parent
 `stage` the root sprite object
 `rectangle` to draw rectangles
 `circle` for circles
 `line` to draw lines
 `text` to display dynamic text
  `group` to group sprites
  `sprite` to create sprites
  `frame` to help capture individual tileset frames
  `frames` to load multiple images into a sprite with tileset images

*/

// The base class that contains props & methods
// shared by all the different sprite types
/*
class DisplayObject {
  constructor(props) {
    commonMethod();
  }
}
*/

class DisplayObject {
  constructor() {
    //The sprite's position and size
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    //Rotation, alpha, visible and scale properties
    this.rotation = 0;
    this.alpha = 1;
    this.visible = true;
    this.scaleX = 1;
    this.scaleY = 1;

    //`pivotX` and `pivotY` let you set the sprite's axis of rotation
    this.pivotX = 0.5;
    this.pivotY = 0.5;

    //Add `vx` and `vy` (velocity) variables that will help us move the sprite
    this.vx = 0;
    this.vy = 0;

    //A "private" `_layer` property
    this._layer = 0;

    //A `children` array on the sprite that will contain all the
    //child sprites in this container
    this.children = [];

    //The sprite's `parent` property
    this.parent = undefined;

    //The sprite's `children` array
    // this.children = [];

    //Optional drop shadow properties.
    //Set `shadow` to `true` if you want the sprite to display a
    //shadow
    this.shadow = false;
    this.shadowColor = "rgba(100, 100, 100, 0.5)";
    this.shadowOffsetX = 3;
    this.shadowOffsetY = 3;
    this.shadowBlur = 3;

    //Optional blend mode property
    this.blendMode = undefined;

    //Properties for advanced features:

    //Image states and animation
    this.frames = [];
    this.loop = true;
    this._currentFrame = 0;
    this.playing = false;

    //Can the sprite be dragged?
    this._draggable = undefined;

    //Is the sprite circular? If it is, it will be given a `radius`
    //and `diameter`
    this._circular = false;

    //Is the sprite `interactive`? If it is, it can become click-able
    //or touchable
    this._interactive = false;

    //The sprite's previous x and y positions
    this.previousX = 0;
    this.previousY = 0;
  }

  /* Essentials */

  //Global position
  get gx() {
    if (this.parent) {
      //The sprite's global x position is a combination of
      //its local x value and its parent's global x value
      return this.x + this.parent.gx;
    } else {
      return this.x;
    }
  }
  get gy() {
    if (this.parent) {
      return this.y + this.parent.gy;
    } else {
      return this.y;
    }
  }

  //Depth layer
  get layer() {
    return this._layer;
  }
  set layer(value) {
    this._layer = value;
    if (this.parent) {
      //Sort the sprite’s parent’s `children` array so that sprites with a
      //higher `layer` value are moved to the end of the array
      this.parent.children.sort((a, b) => a.layer - b.layer);
    }
  }

  //The `addChild` method lets you add sprites to this container
  addChild(sprite) {
    //Remove the sprite from its current parent, if it has one, and
    //the parent isn't already this object
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    //Make this object the sprite's parent and
    //add it to this object's `children` array
    sprite.parent = this;
    this.children.push(sprite);
  }

  //The `removeChild` method lets you remove a sprite from its
  //parent container
  removeChild(sprite) {
    if (sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);
    } else {
      throw new Error(sprite + "is not a child of " + this);
    }
  }

  //Getters that return useful points on the sprite

  get halfWidth() {
    return this.width / 2;
  }
  get halfHeight() {
    return this.height / 2;
  }
  get centerX() {
    return this.x + this.halfWidth;
  }
  get centerY() {
    return this.y + this.halfHeight;
  }

  /* Conveniences */

  //A `position` getter. It returns an object with x and y properties
  get position() {
    return { x: this.x, y: this.y };
  }

  //A `setPosition` method to quickly set the sprite's x and y values
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  //The `localBounds` and `globalBounds` methods return an object
  //with `x`, `y`, `width`, and `height` properties that define
  //the dimensions and position of the sprite. This is a convenience
  //to help you set or test boundaries without having to know
  //these numbers or request them specifically in your code.
  get localBounds() {
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
  }
  get globalBounds() {
    return {
      x: this.gx,
      y: this.gy,
      width: this.gx + this.width,
      height: this.gy + this.height,
    };
  }

  //`empty` is a convenience property that will return `true` or
  //`false` depending on whether or not this sprite's `children`
  //array is empty
  get empty() {
    if (this.children.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  //The "put" methods help you position
  //another sprite in and around this sprite. You can position
  //sprites relative to this sprite's center, top, eight, bottom or
  //left sides. The `xOffset` and `yOffset`
  //arguments determine by how much the other sprite's position
  //should be offset from the position.
  //In all these methods, `b` is the second sprite that is being
  //positioned relative to the first sprite (this one), `a`

  //Center `b` inside `a`
  putCenter(b, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.halfWidth - b.halfWidth + xOffset;
    b.y = a.y + a.halfHeight - b.halfHeight + yOffset;
  }
  //Position `b` above `a`
  putTop(b, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.halfWidth - b.halfWidth + xOffset;
    b.y = a.y - b.height + yOffset;
  }
  //Position `b` to the right of `a`
  putRight(b, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.width + xOffset;
    b.y = a.y + a.halfHeight - b.halfHeight + yOffset;
  }
  //Position `b` below `a`
  putBottom(b, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.halfWidth - b.halfWidth + xOffset;
    b.y = a.y + a.height + yOffset;
  }
  //Position `b` to the left of `a`
  putLeft(b, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x - b.width + xOffset;
    b.y = a.y + a.halfHeight - b.halfHeight + yOffset;
  }

  //Some extra conveniences for working with child sprites

  //Swap the depth layer positions of two child sprites
  swapChildren(child1, child2) {
    let index1 = this.children.indexOf(child1),
      index2 = this.children.indexOf(child2);
    if (index1 !== -1 && index2 !== -1) {
      //Swap the indexes
      child1.childIndex = index2;
      child2.childIndex = index1;
      //Swap the array positions
      this.children[index1] = child2;
      this.children[index2] = child1;
    } else {
      throw new Error(`Both objects must be a child of the caller ${this}`);
    }
  }

  //`add` and `remove` let you add and remove many sprites at the same time
  add(...spritesToAdd) {
    spritesToAdd.forEach((sprite) => this.addChild(sprite));
  }
  remove(...spritesToRemove) {
    spritesToRemove.forEach((sprite) => this.removeChild(sprite));
  }

  /* Advanced features */

  //If the sprite has more than one frame, return the
  //value of `_currentFrame`
  get currentFrame() {
    return this._currentFrame;
  }

  //The `circular` property lets you define whether a sprite
  //should be interpreted as a circular object. If you set
  //`circular` to `true`, the sprite is given `radius` and `diameter`
  //properties. If you set `circular` to `false`, the `radius`
  //and `diameter` properties are deleted from the sprite
  get circular() {
    return this._circular;
  }
  set circular(value) {
    //Give the sprite `diameter` and `radius` properties
    //if `circular` is `true`
    if (value === true && this._circular === false) {
      Object.defineProperties(this, {
        diameter: {
          get() {
            return this.width;
          },
          set(value) {
            this.width = value;
            this.height = value;
          },
          enumerable: true,
          configurable: true,
        },
        radius: {
          get() {
            return this.halfWidth;
          },
          set(value) {
            this.width = value * 2;
            this.height = value * 2;
          },
          enumerable: true,
          configurable: true,
        },
      });
      //Set this sprite's `_circular` property to `true`
      this._circular = true;
    }
    //Remove the sprite's `diameter` and `radius` properties
    //if `circular` is `false`
    if (value === false && this._circular === true) {
      delete this.diameter;
      delete this.radius;
      this._circular = false;
    }
  }

  //Is the sprite draggable by the pointer? If `draggable` is set
  //to `true`, the sprite is added to a `draggableSprites`
  //array. All the sprites in `draggableSprites` are updated each
  //frame to check whether they're being dragged
  get draggable() {
    return this._draggable;
  }
  set draggable(value) {
    if (value === true) {
      //Push the sprite into the `draggableSprites` array
      draggableSprites.push(this);
      this._draggable = true;
    }
    //If it's `false`, remove it from the `draggableSprites` array
    if (value === false) {
      //Splice the sprite from the `draggableSprites` array
      draggableSprites.splice(draggableSprites.indexOf(this), 1);
    }
  }

  //Is the sprite interactive? If `interactive` is set to `true`,
  //the sprite is run through the `makeInteractive` function.
  //`makeInteractive` makes the sprite sensitive to pointer
  //actions. It also adds the sprite to the `buttons` array,
  //which is updated each frame
  get interactive() {
    return this._interactive;
  }
  set interactive(value) {
    if (value === true) {
      //Add interactive properties to the sprite
      //so that it can act like a button
      makeInteractive(this);

      //Add the sprite to the global `buttons` array so
      //it can be updated each frame
      buttons.push(this);

      //Set this sprite’s private `_interactive` property to `true`
      this._interactive = true;
    }
    if (value === false) {
      //Remove the sprite's reference from the
      //`buttons` array so that it it's no longer affected
      //by mouse and touch interactivity
      buttons.splice(buttons.indexOf(this), 1);
      this._interactive = false;
    }
  }
}

// A universal function to remove any sprite or list of
// sprites from any parent

export function remove(...spritesToRemove) {
  spritesToRemove.forEach((sprite) => {
    sprite.parent.removeChild(sprite);
  });
}

// A specific sprite type that extends DisplayObject
// and implements its own unique methods and props
class SpriteType extends DisplayObject {
  constructor() {
    // call DisplayObject's constructor to init
    // all the default props
    super();
    // init the sprite's specific props
  }
}

// a module to create a canvas
export function makeCanvas(
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

// a module to create a responsive canvas
export function responsiveCanvas(
  width = window.innerWidth,
  height = window.innerHeight,
  border = "1px solid black",
  backgroundColor = "white"
) {
  let canvas = document.getElementById("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = border;
  canvas.style.backgroundColor = backgroundColor;
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvas.ctx = canvas.getContext("2d");

  // return the canvas
  return canvas;
}

/* ****** The Root Stage Object ****** */
export let stage = new DisplayObject();
// stage.width = canvas.width;
// stage.height = canvas.height;

// The `Rectangle` class
class Rectangle extends DisplayObject {
  constructor(
    width = 32,
    height = 32,
    fillStyle = "gray",
    strokeStyle = "none",
    lineWidth = 0,
    x = 0,
    y = 0
  ) {
    //Call the DisplayObject's constructor
    super();

    //Assign the argument values to this sprite
    Object.assign(this, {
      width,
      height,
      fillStyle,
      strokeStyle,
      lineWidth,
      x,
      y,
    });

    //Add a `mask` property to enable optional masking
    this.mask = false;
  }
  //The `render` method explains how to draw the sprite
  render(ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.rect(
      //Draw the sprite around its `pivotX` and `pivotY` point
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
    if (this.mask && this.mask === true) ctx.clip();
  }
}

//A higher level wrapper for the rectangle sprite
export function rectangle(
  width,
  height,
  fillStyle,
  strokeStyle,
  lineWidth,
  x,
  y
) {
  //Create the sprite
  let sprite = new Rectangle(
    width,
    height,
    fillStyle,
    strokeStyle,
    lineWidth,
    x,
    y
  );

  //Add the sprite to the stage
  stage.addChild(sprite);

  //Return the sprite to the main program
  return sprite;
}

// The `Circle` class
class Circle extends DisplayObject {
  constructor(
    diameter = 32,
    fillStyle = "gray",
    strokeStyle = "none",
    lineWidth = 0,
    x = 0,
    y = 0
  ) {
    // Call the DisplaObject's constructor
    super();

    // enable radius and diameter props
    this.circular = true;

    // assign the arguent values to this sprite
    Object.assign(this, {
      diameter,
      fillStyle,
      strokeStyle,
      lineWidth,
      x,
      y,
    });

    // add a mask prop to enable optional masking
    this.mask = false;
  }

  // The render method

  render(ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(
      // arc(centerX, centerY, circleRadius, startAngle, endAngle, false)
      // (The startAngle’s 0 position is at the circle’s 3 o’clock position.)
      this.radius + -this.diameter * this.pivotX,
      this.radius + -this.diameter * this.pivotY,
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
    if (this.mask && this.mask === true) ctx.clip();
  }
}

// A higher level wrapper for the circle sprite
export function circle(diameter, fillStyle, strokeStyle, lineWidth, x, y) {
  let sprite = new Circle(diameter, fillStyle, strokeStyle, lineWidth, x, y);
  stage.addChild(sprite);
  return sprite;
}

// The `Arc` class
// arc(centerX, centerY, circleRadius, startAngle, endAngle, false)
// NB: `false` means that the curve is drawn clockwise
// (The startAngle’s 0 position is at the circle’s 3 o’clock position.)
class Arc extends DisplayObject {
  constructor(
    diameter = 32,
    fillStyle = "none",
    strokeStyle = "black",
    lineWidth = 1,
    startAngle = 3.14,
    endAngle = 0,
    x = 0,
    y = 0,
    ACW = false,
    closeArc = false
  ) {
    // Call the DisplaObject's constructor
    super();

    // enable radius and diameter props
    this.circular = true;

    // assign the arguent values to this sprite
    Object.assign(this, {
      diameter,
      fillStyle,
      strokeStyle,
      lineWidth,
      startAngle,
      endAngle,
      x,
      y,
      ACW,
      closeArc,
    });

    // add a mask prop to enable optional masking
    this.mask = false;
    // default line join type
    this.lineJoin = "round";
  }

  // The render method
  // arc(centerX, centerY, circleRadius, startAngle, endAngle, false)
  // (The startAngle’s 0 position is at the circle’s 3 o’clock position.)
  render(ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(
      this.radius + -this.diameter * this.pivotX,
      this.radius + -this.diameter * this.pivotY,
      this.radius,
      this.startAngle,
      this.endAngle,
      this.ACW,
      this.closeArc
    );
    if (this.closeArc) ctx.closePath();
    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
    if (this.mask && this.mask === true) ctx.clip();
  }
}

// A higher level wrapper for the arc sprite
/*       ****** A note on positioning the arc sprite ******

  The arc sprite is positioned as if it were a complete circle,
  thus, if you create a semi-circle with this sprite and say,
  use the `putTop` method of another sprite to position the
  semi-circle, you will have to offset the Y position by the
  diameter of the arc in order for the semi-circle to sit
  flush to the top of sprite you are positioning it onto.

*/
export function arc(
  diameter,
  fillStyle,
  strokeStyle,
  lineWidth,
  startAngle,
  endAngle,
  x,
  y,
  ACW,
  closeArc
) {
  let sprite = new Arc(
    diameter,
    fillStyle,
    strokeStyle,
    lineWidth,
    startAngle,
    endAngle,
    x,
    y,
    ACW,
    closeArc
  );
  stage.addChild(sprite);
  return sprite;
}

class QuadCurve extends DisplayObject {
  constructor(
    strokeStyle = "black",
    fillStyle = "none",
    lineWidth = 1,
    ax = 0,
    ay = 32,
    cpx = 32, // control point X
    cpy = 0, // control point Y
    bx = 64,
    by = 32,
    closeCurve = true
  ) {
    // call the display object's contructor
    super();

    // Assign the argument values to this sprite
    Object.assign(this, {
      strokeStyle,
      fillStyle,
      lineWidth,
      ax,
      ay,
      cpx,
      cpy,
      bx,
      by,
      closeCurve,
    });

    // style =  round, mitre or bevel
    this.lineJoin = "round";
    // mask
    this.mask = false;

    // this.width = Math.abs(this.bx - this.ax);
    // this.height = Math.abs(this.ay - this.cpy);
  }

  // the render method
  render(ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = this.lineJoin;
    ctx.beginPath();
    ctx.moveTo(this.ax, this.ay);
    ctx.quadraticCurveTo(this.cpx, this.cpy, this.bx, this.by);
    if (this.closeCurve === true) ctx.closePath();
    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
  }
}

// A higher level wrapper for the quadCurve sprite
export function quadCurve(
  strokeStyle,
  fillStyle,
  lineWidth,
  ax,
  ay,
  cpx,
  cpy,
  bx,
  by,
  closeCurve
) {
  let sprite = new QuadCurve(
    strokeStyle,
    fillStyle,
    lineWidth,
    ax,
    ay,
    cpx,
    cpy,
    bx,
    by,
    closeCurve
  );
  stage.addChild(sprite);
  return sprite;
}

class BezCurve extends DisplayObject {
  constructor(
    strokeStyle = "black",
    fillStyle = "none",
    lineWidth = 1,
    ax = 0,
    ay = 32,
    cp1x = 0,
    cp1y = 0,
    cp2x = 128,
    cp2y = 0,
    bx = 128,
    by = 32,
    closeCurve = true
  ) {
    // call DisplayObject's constructor
    super();

    // Assign the argument values to this sprite
    Object.assign(this, {
      strokeStyle,
      fillStyle,
      lineWidth,
      ax,
      ay,
      cp1x,
      cp1y,
      cp2x,
      cp2y,
      bx,
      by,
      closeCurve,
    });

    // line join style; round mitre or bevel
    this.lineJoin = "round";
    // add mask property
    this.mask = false;
  }

  // the render method explains how to draw the sprite
  render(ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.lineWidth = this.lineWidth;
    // ctx.lineJoin = this.lineJoin;
    ctx.beginPath();
    ctx.moveTo(this.ax, this.ay);
    ctx.bezierCurveTo(
      this.cp1x,
      this.cp1y,
      this.cp2x,
      this.cp2y,
      this.bx,
      this.by
    );
    if (this.closeCurve === true) ctx.closePath();
    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
  }
}

// A high level wrapper for the BezCurve sprite
export function bezCurve(
  strokeStyle,
  fillStyle,
  lineWidth,
  ax,
  ay,
  cp1x,
  cp1y,
  cp2x,
  cp2y,
  bx,
  by,
  closeCurve
) {
  let sprite = new BezCurve(
    strokeStyle,
    fillStyle,
    lineWidth,
    ax,
    ay,
    cp1x,
    cp1y,
    cp2x,
    cp2y,
    bx,
    by,
    closeCurve
  );
  stage.addChild(sprite);
  return sprite;
}

// The Line class
class Line extends DisplayObject {
  constructor(
    strokeStyle = "none",
    lineWidth = 0,
    ax = 0,
    ay = 0,
    bx = 32,
    by = 32
  ) {
    // call the DisplayObject's constructor:
    super();

    // Assign the argument values to this sprite
    Object.assign(this, {
      strokeStyle,
      lineWidth,
      ax,
      ay,
      bx,
      by,
    });

    // The `lineJoin` style: round, mitre or bevel
    this.lineJoin = "round";
  }

  // The render method
  render(ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = this.lineJoin;
    ctx.beginPath();
    ctx.moveTo(this.ax, this.ay);
    ctx.lineTo(this.bx, this.by);
    if (this.strokeStyle !== "none") ctx.stroke();
  }
}

// A higher level wrapper for the line sprite
export function line(strokeStyle, lineWidth, ax, ay, bx, by) {
  let sprite = new Line(strokeStyle, lineWidth, ax, ay, bx, by);
  stage.addChild(sprite);
  return sprite;
}

// The Text class
class Text extends DisplayObject {
  constructor(
    content = "Hello!",
    font = "12px sans-serif",
    fillStyle = "red",
    x = 0,
    y = 0
  ) {
    // call the DisplayObject's constructor
    super();

    // Assign the arguments values to this sprite
    Object.assign(this, { content, font, fillStyle, x, y });

    // set the default text baseline to "top"
    this.textBaseline = "top";

    // set `strokeText` to none
    this.strokeText = "none";
  }

  // the render method describes how to draw the sprite
  render(ctx) {
    ctx.font = this.font;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;

    // measure the width and height of the text
    if (this.width === 0) this.width = ctx.measureText(this.content).width;
    if (this.height === 0) this.height = ctx.measureText("M").width;

    ctx.translate(-this.width * this.pivotX, -this.height * this.pivotY);
    ctx.textBaseline = this.textBaseline;
    ctx.fillText(this.content, 0, 0);
    if (this.strokeText !== "none") ctx.strokeText();
  }
}

// A higher level wrapper for the Text class
export function text(content, font, fillStyle, x, y) {
  let sprite = new Text(content, font, fillStyle, x, y);
  stage.addChild(sprite);
  return sprite;
}

// Text On A Curve Sprite
/* Notes:
   For a full circle:
   Start angle = 0 (the 3 'O clock position)
   End angle = 6.28 (2 * Math.PI)
*/
class CurvedText extends DisplayObject {
  constructor(
    content = "Hello!",
    font = "12px sans-serif",
    fillStyle = "red",
    x = 0,
    y = 0,
    radius = 100,
    angle = Math.PI * 0.5 // rads
  ) {
    // call the DisplayObject's constructor
    super();

    // Assign the arguments values to this sprite
    Object.assign(this, { content, font, fillStyle, x, y, radius, angle });

    // set the default text baseline to "top"
    this.textBaseline = "top";

    // set `strokeText` to none
    this.strokeText = "none";

    // give the object radius and diameter properties
    // this.circular = true;
  }

  // the render method describes how to draw the sprite
  render(ctx) {
    ctx.font = this.font;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((-1 * this.angle) / 2);
    ctx.rotate((-1 * (this.angle / this.content.length)) / 2);
    for (let i = 0; i < this.content.length; i++) {
      ctx.rotate(this.angle / this.content.length);
      ctx.save();

      ctx.translate(0, -1 * this.radius);

      // replaced the above line with these below
      // if (this.width === 0) {
      //   this.width = this.radius * 2 + ctx.measureText("M").width * 2;
      //   this.height = this.width;
      // }
      // ctx.translate(0, -this.height * this.pivotY);
      // end of test

      ctx.fillText(this.content[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // console.log(this.width);

    // Stuff from  the old Text Sprite Class
    // measure the width and height of the text
    /*
    if (this.width === 0) this.width = ctx.measureText(this.content).width;
    if (this.height === 0) this.height = ctx.measureText("M").width;

    ctx.translate(-this.width * this.pivotX, -this.height * this.pivotY);
    ctx.textBaseline = this.textBaseline;
    ctx.fillText(this.content, 0, 0);
    if (this.strokeText !== "none") ctx.strokeText();
    */
  }
}

// A higher level wrapper for the Text On A Curve class
export function curvedText(content, font, fillStyle, x, y, radius, angle) {
  let sprite = new CurvedText(content, font, fillStyle, x, y, radius, angle);
  stage.addChild(sprite);
  return sprite;
}

// The Group class. This does not display any of its own
// graphics, but is used to group sprites together. It can
// be used for complex game characters, game scenes or levels
// A groups height & width is calculated dynamically based on
// the content that it contains.
class Group extends DisplayObject {
  constructor(...spritesToGroup) {
    // call the DisplayObject's constructor
    super();

    // group all the sprites listed in the constructor args
    spritesToGroup.forEach((sprite) => this.addChild(sprite));
  }

  // Groups have custom `addChild` & `removeChild` methods that
  // call a `calculateSize` method when sprites are added
  // or removed from the group
  addChild(sprite) {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    sprite.parent = this;
    this.children.push(sprite);

    // figure out the new  size of the group
    this.calculateSize();
  }

  removeChild(sprite) {
    if (sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);

      // figure out the new size of the group
      this.calculateSize();
    } else {
      throw new Error(`${sprite} is not a child of ${this}`);
    }
  }

  calculateSize() {
    // calculate the width based on the size of the largest child
    // that this sprite contains
    if (this.children.length > 0) {
      // temp private vars to help track the new
      // calculated height and width
      this._newWidth = 0;
      this._newHeight = 0;

      // find the width and height of the child sprites furthest
      // from the top left corner of the group
      this.children.forEach((child) => {
        // find the child sprites that combined x value and width
        // that's greater than the current `_newWidth` value
        if (child.x + child.width > this._newWidth) {
          // The new width is a combination of the child's
          // x position and its width
          this._newWidth = child.x + child.width;
        }
        if (child.y + child.height > this._newHeight) {
          this._newHeight = child.y + child.height;
        }
      });

      // Apply `_newWidth` & `_newHeight` to the sprite's
      // width and height
      this.width = this._newWidth;
      this.height = this._newHeight;
    }
  }
}

// A higher level wrapper for the Group sprite
export function group(...spritesToGroup) {
  let sprite = new Group(...spritesToGroup);
  stage.addChild(sprite);
  return sprite;
}

/* ******Full Featured Render Function ****** */
export function render(canvas) {
  //Get a reference to the context
  let ctx = canvas.ctx;
  //Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Loop through each sprite object in the stage's `children` array
  stage.children.forEach((sprite) => {
    //Display a sprite
    displaySprite(sprite);
  });
  function displaySprite(sprite) {
    //Only display the sprite if it's visible
    //and within the area of the canvas
    if (
      sprite.visible &&
      sprite.gx < canvas.width + sprite.width &&
      sprite.gx + sprite.width >= -sprite.width &&
      sprite.gy < canvas.height + sprite.height &&
      sprite.gy + sprite.height >= -sprite.height
    ) {
      //Save the canvas's present state
      ctx.save();

      //Shift the canvas to the center of the sprite's position
      ctx.translate(
        sprite.x + sprite.width * sprite.pivotX,
        sprite.y + sprite.height * sprite.pivotY
      );
      //Set the sprite's `rotation`, `alpha` and `scale`
      ctx.rotate(sprite.rotation);
      ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
      ctx.scale(sprite.scaleX, sprite.scaleY);
      //Display the sprite's optional drop shadow
      if (sprite.shadow) {
        ctx.shadowColor = sprite.shadowColor;
        ctx.shadowOffsetX = sprite.shadowOffsetX;
        ctx.shadowOffsetY = sprite.shadowOffsetY;
        ctx.shadowBlur = sprite.shadowBlur;
      }
      //Display the optional blend mode
      if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;
      //Use the sprite's own `render` method to draw the sprite
      if (sprite.render) sprite.render(ctx);
      if (sprite.children && sprite.children.length > 0) {
        //Reset the context back to the parent sprite's top-left corner,
        //relative to the pivot point
        ctx.translate(
          -sprite.width * sprite.pivotX,
          -sprite.height * sprite.pivotY
        );
        //Loop through the parent sprite's children
        sprite.children.forEach((child) => {
          //display the child
          displaySprite(child);
        });
      }
      //Restore the canvas to its previous state
      ctx.restore();
    }
  }
}
/* ****** END Full Featured Render Function ****** */

/* ****** Render with Interpolation Function ****** */
// for use inside a fixed timestep game loop. use like:

// renderWithInterpolation(canvasContext, lagOffset);

export function renderWithInterpolation(canvas, lagOffset) {
  //Get a reference to the context
  let ctx = canvas.ctx;
  //Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Loop through each sprite object in the stage's `children` array
  stage.children.forEach((sprite) => {
    //Display a sprite
    displaySprite(sprite);
  });
  function displaySprite(sprite) {
    //Only display the sprite if it's visible
    //and within the area of the canvas
    if (
      sprite.visible &&
      sprite.gx < canvas.width + sprite.width &&
      sprite.gx + sprite.width >= -sprite.width &&
      sprite.gy < canvas.height + sprite.height &&
      sprite.gy + sprite.height >= -sprite.height
    ) {
      //Save the canvas's present state
      ctx.save();

      // code difference from the normal render function
      // this calculates the sprites' rendered positions.
      // Interpolation:
      if (sprite.previousX !== undefined) {
        sprite.renderX =
          (sprite.x - sprite.previousX) * lagOffset + sprite.previousX;
      } else {
        sprite.renderX = sprite.x;
      }
      if (sprite.previousY !== undefined) {
        sprite.renderY =
          (sprite.y - sprite.previousY) * lagOffset + sprite.previousY;
      } else {
        sprite.renderY = sprite.y;
      }

      // draw the sprite at its interpolated position
      ctx.translate(
        sprite.renderX + sprite.width * sprite.pivotX,
        sprite.renderY + sprite.height * sprite.pivotY
      );

      /*
      //Shift the canvas to the center of the sprite's position
      ctx.translate(
        sprite.x + sprite.width * sprite.pivotX,
        sprite.y + sprite.height * sprite.pivotY
      );
      */

      //Set the sprite's `rotation`, `alpha` and `scale`
      ctx.rotate(sprite.rotation);
      ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
      ctx.scale(sprite.scaleX, sprite.scaleY);
      //Display the sprite's optional drop shadow
      if (sprite.shadow) {
        ctx.shadowColor = sprite.shadowColor;
        ctx.shadowOffsetX = sprite.shadowOffsetX;
        ctx.shadowOffsetY = sprite.shadowOffsetY;
        ctx.shadowBlur = sprite.shadowBlur;
      }
      //Display the optional blend mode
      if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;
      //Use the sprite's own `render` method to draw the sprite
      if (sprite.render) sprite.render(ctx);
      if (sprite.children && sprite.children.length > 0) {
        //Reset the context back to the parent sprite's top-left corner,
        //relative to the pivot point
        ctx.translate(
          -sprite.width * sprite.pivotX,
          -sprite.height * sprite.pivotY
        );
        //Loop through the parent sprite's children
        sprite.children.forEach((child) => {
          //display the child
          displaySprite(child);
        });
      }
      //Restore the canvas to its previous state
      ctx.restore();
    }
  }
}

/* ****** END Render with Interpolation Function ****** */

class Sprite extends DisplayObject {
  constructor(source, x = 0, y = 0) {
    // call the displayObject's super
    super();

    // assign the argument values to this sprite
    Object.assign(this, { x, y });

    /* ********* What is the source? ********* */
    // figure out what the source is, then use that
    // source data to display the sprite correctly

    // is the source a JS image object?
    if (source instanceof Image) {
      this.createFromImage(source);
    }
    // If the source has a `frame` property the
    // source is a tileset from a texture atlas
    else if (source.frame) {
      this.createFromAtlas(source);
    }

    // If the source contains an `image` subproperty, this must
    // be a `frame` object that's defining the rectangular area
    // of an inner subimage.
    // Use that subimage to make the sprite. If it doesn't contain a
    //`data` property, then it must be a single frame
    else if (source.image && !source.data) {
      this.createFromTileset(source);
    }

    // If the source contains an `image` subproperty and
    // a `data` property, it contains multiple frames
    else if (source.image && source.data) {
      this.createFromTilesetFrames(source);
    }

    // Is the source an array? If so, what kind of array?
    else if (source instanceof Array) {
      if (source[0] && source[0].source) {
        // the source is an array of frames on a texture
        // atlas tileset
        this.createFromAtlasFrames(source);
      }

      // it must be an array of image objects
      else if (source[0] instanceof Image) {
        this.createFromImages(source);
      }

      // throw an error if the sources in the array
      // aren't reckognised
      else {
        throw new Error(`The image sources in ${source} are not reckognised`);
      }
    }
    //Throw an error if the source is something we can't interpret
    else {
      throw new Error(`The image source ${source} is not recognized`);
    }
  }

  createFromImage(source) {
    // throw an error if the source is not an Image object
    if (!(source instanceof Image)) {
      throw new Error(`${source} is not an image object`);
    }
    // otherwise, create the sprite using an image
    else {
      this.source = source;
      this.sourceX = 0;
      this.sourceY = 0;
      this.width = source.width;
      this.height = source.height;
      this.sourceWidth = source.width;
      this.sourceHeight = source.height;
    }
  }

  createFromAtlas(source) {
    this.tilesetFrame = source;
    this.source = this.tilesetFrame.source;
    this.sourceX = this.tilesetFrame.frame.x;
    this.sourceY = this.tilesetFrame.frame.y;
    this.width = this.tilesetFrame.frame.w;
    this.height = this.tilesetFrame.frame.h;
    this.sourceWidth = this.tilesetFrame.frame.w;
    this.sourceHeight = this.tilesetFrame.frame.h;
  }

  createFromTileset(source) {
    if (!(source.image instanceof Image)) {
      throw new Error(`${source.image} is not an image object`);
    } else {
      this.source = source.image;
      this.sourceX = source.x;
      this.sourceY = source.y;
      this.width = source.width;
      this.height = source.height;
      this.sourceWidth = source.width;
      this.sourceHeight = source.height;
    }
  }

  createFromTilesetFrames(source) {
    if (!(source.image instanceof Image)) {
      throw new Error(`${source.image} is not an Image object`);
    } else {
      this.source = source.image;
      this.frames = source.data;

      // set the sprite to the first frame
      this.sourceX = this.frames[0][0];
      this.sourceY = this.frames[0][1];
      this.width = source.width;
      this.height = source.height;
      this.sourceWidth = source.width;
      this.sourceHeight = source.height;
    }
  }

  createFromAtlasFrames(source) {
    this.frames = source;
    this.source = source[0].source;
    this.sourceX = source[0].frame.x;
    this.sourceY = source[0].frame.y;
    this.width = source[0].frame.w;
    this.height = source[0].frame.h;
    this.sourceWidth = source[0].frame.w;
    this.sourceHeight = source[0].frame.h;
  }

  createFromImages(source) {
    this.frames = source;
    this.source = source[0];
    this.sourceX = 0;
    this.sourceY = 0;
    this.width = source[0].width;
    this.height = source[0].height; // Not Height??? Yes!!!
    this.sourceWidth = source[0].width;
    this.sourceHeight = source[0].height;
  }

  // Add a `gotoAndStop` method to go to a specif frame
  gotoAndStop(frameNumber) {
    if (this.frames.length > 0 && frameNumber < this.frames.length) {
      //a. Frames made from tileset subimages.
      //If each frame is an array, then the frames were made from an
      //ordinary Image object using the `frames` method
      if (this.frames[0] instanceof Array) {
        this.sourceX = this.frames[frameNumber][0];
        this.sourceY = this.frames[frameNumber][1];
      }

      //b. Frames made from texture atlas frames.
      //If each frame isn't an array, and it has a subobject called `frame`,
      //then the frame must be a texture atlas ID name.
      //In that case, get the source position from the atlas's `frame` object
      else if (this.frames[frameNumber].frame) {
        this.sourceX = this.frames[frameNumber].frame.x;
        this.sourceY = this.frames[frameNumber].frame.y;
        this.sourceWidth = this.frames[frameNumber].frame.w;
        this.sourceHeight = this.frames[frameNumber].frame.h;
        this.width = this.frames[frameNumber].frame.w;
        this.height = this.frames[frameNumber].frame.h;
      }

      //c. Frames made from individual Image objects.
      //If neither of the above is true, then each frame must be
      //an individual Image object
      else {
        this.source = this.frames[frameNumber];
        this.sourceX = 0;
        this.sourceY = 0;
        this.width = this.source.width;
        this.height = this.source.height;
        this.sourceWidth = this.source.width;
        this.sourceHeight = this.source.height;
      }

      // set the `_currentFrame` value to the chosen frame
      this._currentFrame = frameNumber;
    }

    // Throw an error if this sprite doesn't contain any frames
    else {
      throw new Error(`Frame number ${frameNumber} does not exist`);
    }
  }

  // the render method
  render(ctx) {
    ctx.drawImage(
      this.source,
      this.sourceX,
      this.sourceY,
      this.sourceWidth,
      this.sourceHeight,
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
  }
}

// a higher level wrapper
export function sprite(source, x, y) {
  let sprite = new Sprite(source, x, y);
  if (sprite.frames.length > 0) {
    addStatePlayer(sprite);
  }
  stage.addChild(sprite);
  return sprite;
}

// A function to help capture individual tileset frames
export function frame(source, x, y, width, height) {
  var o = {};
  o.image = source;
  o.x = x;
  o.y = y;
  o.width = width;
  o.height = height;
  return o;
}
// function to load multiple images into a sprite with tileset images, it
// lets us specify an array of x / y positions of sub-images we want to use
export function frames(source, arrayOfPositions, width, height) {
  var o = {};
  o.image = source;
  o.data = arrayOfPositions;
  o.width = width;
  o.height = height;
  return o;
}

// A buttons array that is required for any
// application that requires buttons
export let buttons = [];

// A Button class that extends the Sprite class
// and sets the sprite's interactive prop to true.
// this will help automatically display image states
// based on pointer interactivity
class Button extends Sprite {
  constructor(source, x = 0, y = 0) {
    super(source, x, y);
    this.interactive = true;
  }
}

// A higher level wrapper for the Button class
export function button(source, x, y) {
  let sprite = new Button(source, x, y);
  stage.addChild(sprite);
  return sprite;
}

// an array for draggable sprites
export let draggableSprites = [];

// ****** The Make Interactive Function ****** \\
/*
The makeInteractive function assigns a handful of new methods to the sprite: press, release, over,
tap, and out. It also adds some properties to the sprite so that we can monitor its interactive state. These
methods will make any sprite behave like a button. But if the sprite is actually an instance of the Button
class, makeInteractive adds a bonus feature: it sets the sprite’s image state to "up", "over", or "down"
depending on what the pointer is doing.
makeInteractive is a reasonably complex bit of code
*/

// This is taken directly from Rex van der Spuy's
// repository: Thank you Rex :o)

function makeInteractive(o) {
  //The `press`, `release`, `over`, `out`, and `tap` methods. They're `undefined`
  //for now, but they can be defined in the game program
  o.press = o.press || undefined;
  o.release = o.release || undefined;
  o.over = o.over || undefined;
  o.out = o.out || undefined;
  o.tap = o.tap || undefined;

  //The `state` property tells you the button's
  //current state. Set its initial state to "up"
  o.state = "up";

  //The `action` property tells you whether it’s being pressed or
  //released
  o.action = "";

  //The `pressed` and `hoverOver` Booleans are mainly for internal
  //use in this code to help figure out the correct state.
  //`pressed` is a Boolean that helps track whether
  //the sprite has been pressed down
  o.pressed = false;

  //`hoverOver` is a Boolean that checks whether the pointer
  //has hovered over the sprite
  o.hoverOver = false;

  //The `update` method will be called each frame
  //inside the game loop
  o.update = (pointer, canvas) => {
    //Figure out if the pointer is touching the sprite
    let hit = pointer.hitTestSprite(o);

    //1. Figure out the current state
    if (pointer.isUp) {
      //Up state
      o.state = "up";

      //Show the first image state frame, if this is a `Button` sprite
      if (o instanceof Button) o.gotoAndStop(0);
    }

    //If the pointer is touching the sprite, figure out
    //if the over or down state should be displayed
    if (hit) {
      //Over state
      o.state = "over";

      //Show the second image state frame if this sprite has
      //3 frames and it's a `Button` sprite
      if (o.frames && o.frames.length === 3 && o instanceof Button) {
        o.gotoAndStop(1);
      }
      //Down state
      if (pointer.isDown) {
        o.state = "down";

        //Show the third frame if this sprite is a `Button` sprite and it
        //has only three frames, or show the second frame if it
        //has only two frames
        if (o instanceof Button) {
          if (o.frames.length === 3) {
            o.gotoAndStop(2);
          } else {
            o.gotoAndStop(1);
          }
        }
      }
    }
    //Perform the correct interactive action

    //a. Run the `press` method if the sprite state is "down" and
    //the sprite hasn't already been pressed
    if (o.state === "down") {
      if (!o.pressed) {
        if (o.press) o.press();
        o.pressed = true;
        o.action = "pressed";
      }
    }

    //b. Run the `release` method if the sprite state is "over" and
    //the sprite has been pressed
    if (o.state === "over") {
      if (o.pressed) {
        if (o.release) o.release();
        o.pressed = false;
        o.action = "released";

        //If the pointer was tapped and the user assigned a `tap`
        //method, call the `tap` method
        if (pointer.tapped && o.tap) o.tap();
      }
      //Run the `over` method if it has been assigned
      if (!o.hoverOver) {
        if (o.over) o.over();
        o.hoverOver = true;
      }
    }

    //c. Check whether the pointer has been released outside
    //the sprite's area. If the button state is "up" and it has
    //already been pressed, then run the `release` method
    if (o.state === "up") {
      if (o.pressed) {
        if (o.release) o.release();
        o.pressed = false;
        o.action = "released";
      }
      //Run the `out` method if it has been assigned
      if (o.hoverOver) {
        if (o.out) o.out();
        o.hoverOver = false;
      }
    }
  };
}

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

      console.log("Arse", sprite.currentFrame);
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

export function filmstrip(image, frameWidth, frameHeight, spacing = 0) {
  // an array to store alll the x / y positions
  let positions = [];

  // find out how many rows and columns there
  // are in the tileset
  let columns = image.width / frameWidth,
    rows = image.height / frameHeight;

  // find the total number of frames
  let numberOfFrames = columns * rows;

  for (let i = 0; i < numberOfFrames; i++) {
    // find the correct row and column for each frame
    // and figure out its x / y position
    let x = (i % columns) * frameWidth,
      y = Math.floor(i / columns) * frameHeight;

    // compensate for any optional spacing around the
    // frames. Accumulate the spacinng offsets from
    // the left side of the tileset and add them to
    // the current tile's position
    if (spacing && spacing > 0) {
      x += spacing + ((spacing * i) % columns);
      y += spacing + spacing * Math.floor(i / columns);
    }

    // add the x / y values of each frame to the
    // positions array
    positions.push([x, y]);
  }

  console.log("positions", positions);

  // create and return the animation frames using
  // the frames() function
  return frames(image, positions, frameWidth, frameHeight);
}

// loop through this array to update all the particles
// on each frame in the gameLoop()
export let particles = [];

export function particleEffect(
  x = 0,
  y = 0,
  spriteFunction = () => circle(10, "goldenrod"),
  numberOfParticles = 10,
  gravity = 0,
  randomSpacing = true,
  minAngle = 0,
  maxAngle = 6.28,
  minSize = 4,
  maxSize = 16,
  minSpeed = 0.1,
  maxSpeed = 1,
  minScaleSpeed = 0.01,
  maxScaleSpeed = 0.05,
  minAlphaSpeed = 0.02,
  maxAlphaSpeed = 0.02,
  minRotationSpeed = 0.01,
  maxRotationSpeed = 0.03
) {
  // random float and random integer functions
  let randomFloat = (min, max) => min + Math.random() * (max - min),
    randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // array to store the angles
  let angles = [],
    // variable to store the current particle angle
    angle;

  // figure out how many radians each particle should be separated by
  let spacing = (maxAngle * minAngle) / (numberOfParticles - 1);

  // create an angle value for each particle and
  // push that angle onto the angles array
  for (let i = 0; i < numberOfParticles; i++) {
    // if randomSpacing is true, give the particle any angle
    // between minAngle & maxAngle
    if (randomSpacing) {
      angle = randomFloat(minAngle, maxAngle);
      angles.push(angle);
    }

    // if randomSpacing is false, space each particle evenly
    // starting with minAngle ane ending at maxAngle
    else {
      if (angle === undefined) angle = minAngle;
      angles.push(angle);
      angle += spacing;
    }
  }

  // make a particle for each angle
  angles.forEach((angle) => makeParticle(angle));

  // make the particle
  function makeParticle(angle) {
    // create the particle using the supplied sprite function
    let particle = spriteFunction();

    // display a random frame if the particle has more than one frame
    if (particle.frames.length > 0) {
      let randomNum = randomInt(0, particle.frames.length - 1);
      console.log(randomNum);
      particle.gotoAndStop(randomNum);
    }

    // set the particle's x / y position
    particle.x = x - particle.halfWidth;
    particle.y = y - particle.halfHeight;

    // set a random width and height
    let size = randomInt(minSize, maxSize);
    particle.width = size;
    particle.height = size;

    // set a random speed to change the scale, alpha and rotation
    particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
    particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed);
    particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed);

    // set a random velocity at which the particle should move
    let speed = randomFloat(minSpeed, maxSpeed);
    particle.vx = speed * Math.cos(angle);
    particle.vy = speed * Math.sin(angle);

    // the particle's update method is called on each frame of the gameLoop
    particle.update = () => {
      // add gravity
      particle.vy += gravity;

      // move the particle
      particle.x += particle.vx;
      particle.y += particle.vy;

      // change t he particle's scale
      if (particle.scaleX - particle.scaleSpeed > 0) {
        particle.scaleX -= particle.scaleSpeed;
      }
      if (particle.scaleY - particle.scaleSpeed > 0) {
        particle.scaleY -= particle.scaleSpeed;
      }

      // change the particle's roatation
      particle.rotation += particle.rotationSpeed;

      // change the particle's alhpa
      particle.alpha -= particle.alphaSpeed;

      // remove the particle if its alpha reaches 0
      if (particle.alpha <= 0) {
        // console.log(particle);
        remove(particle);

        particles.splice(particles.indexOf(particle), 1);
      }
    };

    // push the particle into the particles array
    particles.push(particle);
  }
}
