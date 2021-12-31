// return a random int between a max and min value

export let randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export let colours = [
  "AliceBlue",
  "AntiqueWhite",
  "Aqua",
  "Aquamarine",
  "Azure",
  "Beige",
  "Bisque",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "GoldenRod",
  "Gray",
  "Grey",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenRodYellow",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "White",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen",
];

/*

contain
-------

Keep a sprite contained inside a boundary

*/

export function contain(sprite, bounds, bounce = false, extra = undefined) {
  let x = bounds.x,
    y = bounds.y,
    width = bounds.width,
    height = bounds.height;

  //The `collision` object is used to store which
  //side of the containing rectangle the sprite hits
  let collision;

  //Left
  if (sprite.x < x) {
    //Bounce the sprite if `bounce` is true
    if (bounce) sprite.vx *= -1;
    //If the sprite has `mass`, let the mass
    //affect the sprite's velocity
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = x;
    collision = "left";
  }
  //Top
  if (sprite.y < y) {
    if (bounce) sprite.vy *= -1;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = y;
    collision = "top";
  }
  //Right
  if (sprite.x + sprite.width > width) {
    if (bounce) sprite.vx *= -1;
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = width - sprite.width;
    collision = "right";
  }
  //Bottom
  if (sprite.y + sprite.height > height) {
    if (bounce) sprite.vy *= -1;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = height - sprite.height;
    collision = "bottom";
  }

  //The `extra` function runs if there was a collision
  //and `extra` has been defined
  if (collision && extra) extra(collision);

  //Return the `collision` object
  return collision;
}

/* 
    ****** Distance ******

A standard function that returns the distance
between two sprites.

s1 = sprite 1
s2 = sprite 2
*/

export function distance(s1, s2) {
  // calculate the vector
  let vx = s2.centerX - s1.centerX,
    vy = s2.centerY - s1.centerY;

  // return the length of the vector
  return Math.sqrt(vx * vx + vy * vy);
}

// ****** Follow With Easing ****** \\
/* ****** A Function Employing a Standard Easing formula ****** */
// Easing makes a sprite gently settle into a destintion point
function followEase(follower, leader, speed) {
  //Figure out the distance between the sprites
  let vx = leader.centerX - follower.centerX,
    vy = leader.centerY - follower.centerY,
    distance = Math.sqrt(vx * vx + vy * vy);

  //Move the follower if it's more than 1 pixel
  //away from the leader
  if (distance >= 1) {
    follower.x += vx * speed;
    follower.y += vy * speed;
  }
}

// ****** Follow At Constant Speed ****** \\
// note: the speed value shoud be the number of pixels you want the
// follower to move at i.e. 3 = 3 pixels per frame
export function followConstant(follower, leader, speed) {
  // figure out the distance between sprites:
  let vx = leader.centerX - follower.centerX;
  let vy = leader.centerY - follower.centerY;
  distance = Math.sqrt(vx * vx + vy * vy);

  // move the follower if it is more than one move away from the leader:
  if (distance >= speed) {
    follower.x += (vx / distance) * speed;
    follower.y += (vy / distance) * speed;
  }
}

// ****** Find The Angle Of Rotation Between Two Sprites ****** \\
// it returns the angle of rotation in radiians.
// You can apply it to a sprite's rotation property to make the sprite rotate

// towards another sprite or the pointer like this:
// let box;
// box.rotation = angle(box, pointer);

export function angle(s1, s2) {
  return Math.atan2(s2.centerY - s1.centerY, s2.centerX - s1.centerX);
}

// ****** Rotate a Sprite Around Another Sprite ****** \\

export function rotateSprite(rotatingSprite, centerSprite, distance, angle) {
  rotatingSprite.x =
    centerSprite.centerX -
    rotatingSprite.parent.x +
    distance * Math.cos(angle) -
    rotatingSprite.halfWidth;

  rotatingSprite.y =
    centerSprite.centerY -
    rotatingSprite.parent.y +
    distance * Math.sin(angle) -
    rotatingSprite.halfWidth;
}

// ****** Rotate a Point in Space Around Another Point ****** \\
export function rotatePoint(pointX, pointY, distanceX, distanceY, angle) {
  let point = {};
  point.x = pointX + Math.cos(angle) * distanceX;
  point.y = pointY + Math.sin(angle) * distanceY;
  // console.log(point);
  return point;
}
