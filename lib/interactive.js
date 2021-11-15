/* ****** Using Pointing Devices ****** */
/*
    Mouse. Touch, Pen
*/

/* Basic event handlers for mousedown and mouseup events

canvas.addEventListener("mousedown", downHandler, false);
canvas.addEventListener("mouseup", upHandler, false);

let downTime, elapsedTime;

function downHandler() {
  downTime = Date.now();
  console.log(downTime);
}

function upHandler() {
  elapsedTime = Math.abs(downTime - Date.now());
  if (elapsedTime <= 200) {
    console.log("Tapped or Clicked");
  } else {
    console.log(`Mouse down and Pressed for: ${elapsedTime}ms`);
  }
}
*/

export function makePointer(element, scale = 1) {
  let pointer = {
    element: element,
    scale: scale,
    // private _x, _y props
    _x: 0,
    _y: 0,

    // change the scale property value according to
    // the change in scale of the element
    // e.g. canvas.
    // this will correct the pointers coords
    get x() {
      return this._x / this.scale;
    },
    get y() {
      return this._y / this.scale;
    },

    // used to get the pointers coords
    get centerX() {
      return this.x;
    },
    get centerY() {
      return this.y;
    },

    // returns an object with the pointers position
    get position() {
      return { x: this.x, y: this.y };
    },

    // track the pointers state
    isDown: false,
    isUp: true,
    tapped: false,

    // props to store times between up and down states
    downTime: 0,
    elapsedTime: 0,

    // Optional user defineable methods
    press: undefined,
    release: undefined,
    tap: undefined,

    // is the pointer touching a sprite?
    // check whether the pointer's x/y position
    // is inside the area of the sprite
    hitTestSprite(sprite) {
      // the hit var will become true if the pointer
      // is touching the sprite & remain false if not
      let hit = false;

      // is the sprite rectangular?
      if (!sprite.circular) {
        // yup! it is!
        // get the position of the sprite's edges using
        // global coordinates
        let left = sprite.gx,
          right = sprite.gx + sprite.width,
          top = sprite.gy,
          bottom = sprite.gy + sprite.height;

        // find out if the pointer is intersecting the rectangle.
        // `hit` will be true if the pointer is inside the
        // sprite's area
        hit =
          this.x > left && this.x < right && this.y > top && this.y < bottom;
      } else {
        // is the sprite circular?
        // yup! it is!
        // find the distance between the pointer and
        // the center of the circle
        let vx = this.x - (sprite.gx + sprite.radius),
          vy = this.y - (sprite.gy + sprite.radius),
          distance = Math.sqrt(vx * vx + vy * vy);

        // the pointer is intesecting the circle if the
        // distance is less than the radius of the circle
        hit = distance < sprite.radius;
      }
      return hit;
    },

    // The pointer's mouse moveHandler
    moveHandler(event) {
      // store the element that's firing the event
      let element = event.target;

      // find the mouse's x, y position
      // subtract the elements top left offset
      // from the browser window
      this._x = event.pageX - element.offsetLeft;
      this._y = event.pageY - element.offsetTop;

      // prevent the default behaviour
      event.preventDefault();
    },

    // the pointer's touchMove handler
    touchmoveHandler(event) {
      let element = event.target;

      // find the touch point x, y position
      this._x = event.targetTouches[0].pageX - element.offsetLeft;
      this._y = event.targetTouches[0].pageY - element.offsetTop;
      event.preventDefault();
    },

    // the pointer's downHandler
    downHandler(event) {
      // set the down states
      this.isDown = true;
      this.isUp = false;
      this.tapped = false;

      // capture the current time
      this.downTime = Date.now();

      // call the press method if it's been assigned by the user
      if (this.press) this.press();
      event.preventDefault();
    },

    // the pointer's touchstart handler
    touchstartHandler(event) {
      let element = event.target;

      // find the touch point's x, y position
      this._x = event.targetTouches[0] - element.offsetLeft;
      this._y = event.targetTouches[0] - element.offsetTop;

      // set the down states
      this.isDown = true;
      this.isUp = false;
      this.tapped = false;

      // capture the current time
      this.downTime = Date.now();

      // call the press method if assigned by the user
      if (this.press) this.press();
      event.preventDefault();
    },

    // the pointer's upHandler
    upHandler(event) {
      // calc the amount of time the pointer has been down
      this.elapsedTime = Math.abs(this.downTime - Date.now());

      // if it's less that 200ms it's a tap or click
      if (this.elapsedTime <= 200 && this.tapped === false) {
        this.tapped = true;

        // call the tap method if it's been assigned
        if (this.tap) this.tap();
      }
      this.isUp = true;
      this.isDown = false;

      // call the release method if assigned by the user
      if (this.release) this.release();
      event.preventDefault();
    },

    // the pointer's touchendHandler
    touchendHandler(event) {
      // time the pointer has been down for
      this.elapsedTime = Math.abs(this.downTime - Date.now());

      // if less than 200ms it's a tap or click
      if (this.elapsedTime <= 200 && this.tapped === false) {
        this.tapped = true;

        // call the tap method if assigned by the user
        if (this.tap) this.tap();
      }
      this.isUp = true;
      this.isDown = false;

      // call the release method if assigned by the user
      if (this.release) this.release();
      event.preventDefault();
    },
  };
  // bind the events to the handlers' mouse events
  element.addEventListener(
    "mousemove",
    pointer.moveHandler.bind(pointer),
    false
  );

  element.addEventListener(
    "mousedown",
    pointer.downHandler.bind(pointer),
    false
  );

  // add the mouseup event to the window object
  // to cath a mouse up event outside of the canvas area
  window.addEventListener("mouseup", pointer.upHandler.bind(pointer), false);

  // touch events

  element.addEventListener(
    "touchmove",
    pointer.touchmoveHandler.bind(pointer),
    false
  );

  element.addEventListener(
    "touchstart",
    pointer.touchstartHandler.bind(pointer),
    false
  );

  // add a touchend event to the window object
  window.addEventListener(
    "touchend",
    pointer.touchendHandler.bind(pointer),
    false
  );

  // disable the default pan and zoom actions on the canvas
  element.style.touchAction = "none";

  // return the pointer
  return pointer;
}

/* ****** The Keyboard Function ****** */

/* 
      This keyboard function creates key objects that listen
      for specific keyboard events.
  
      Use it like this:
  
      let keyObject = keyboard(asciiKeyCodeNumber)
  
      where `keyObject` is the key that we want to add an
      event listener for. Then we can assign `press` and `release`
      methods to the keyObject like this:
  
      keyObject.press = function(){
          // Key object pressed
      }
  
      keyObject.release = function() {
          // Key object released
      }
  
      We have also added isUp and isDown methods to our
      keyObjects tht we can check when required. This will let
      us know whether the key has been released or not and do
      something like this:
  
      if (space.isDown) {
          // Do this!
      }
  
      if (space.isUp) {
          // Do this!
      }
  */

export function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  // the downHandler
  key.downHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      //   console.log(
      //     "e:",
      //     event,
      //     "e.keyCode:",
      //     event.keyCode,
      //     "key.isDown",
      //     key.isDown
      //   );
    }
    event.preventDefault();
  };

  // the uphandler
  key.uphandler = function (event) {
    // console.log(event);
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  // Attach the event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);

  window.addEventListener("keyup", key.uphandler.bind(key), false);

  // return the key object
  return key;
}

/* ****** Some Common Key Objects Ready To Go ****** */
export let space = keyboard(32);
space.press = function () {
  console.log("space pressed", this.code);
};

space.release = function () {
  console.log("space released", this.code);
};

export let left = keyboard(37);
left.press = () => console.log("left arrow pressed", left.code);
left.release = () => console.log("left arrow released", left.code);

export let up = keyboard(38);
up.press = () => console.log("up arrow pressed", up.code);
up.release = () => console.log("up arrow released", up.code);

export let right = keyboard(39);
right.press = () => console.log("right arrow pressed", right.code);
right.release = () => console.log("right arrow released", right.code);

export let down = keyboard(40);
down.press = () => console.log("down arrow pressed", down.code);
down.release = () => console.log("down arrow released", down.code);
