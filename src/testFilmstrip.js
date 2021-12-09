console.log("OK! We're all set to go!");
// ****** Test File ****** \\
/*
    OK! This little file is to figure out how the filmstrip
    function works.

    The filmstrip function uses the JS modulo (remainder)
    operand to figure out the x coordinates of each
    frame in a tileset image. Then uses Math.floor to
    round down the frame number / number of columns.
*/

// to start we define the how many columns and rows
// the tileset image has
let columns = 9,
  rows = 4;

// calculate the number of frames in the tilset
let numberOfFrames = columns * rows;

// state the width and height of each frame
let frameWidth = 64,
  frameHeight = 64;

// define a variable to accomodate spacing between frames
let spacing = 2;

// create an array to store the x / y positions of each frame
let positions = [];

console.log(
  `number of columns ${columns}\nnumber of rows ${rows}\nspacing ${spacing}\nnumber of frames ${numberOfFrames}`
);

// we then use this use this loop to figure out
// the x / y position of each frame in the tileset
for (let i = 0; i < numberOfFrames; i++) {
  // find the correct column number for each frame
  // and figure out its `x` position
  let x = (i % columns) * frameWidth;

  // Explains the result of first part of the equation (i % columns)
  // i.e. the column number
  console.log(
    "Frame Number i =",
    i,
    " Number of columns:",
    columns,
    "\ntherefore: i % number of columns = column number",
    i % columns
  );

  // calculate `x` (the frame's top left position)
  console.log(
    "(i % columns) * frameWidth is the `x` position:",
    (i % columns) * frameWidth
  );

  // do the same for the `y` position
  // i.e. find the row each frame is on
  let y = Math.floor(i / columns) * frameHeight;
  console.log(`i ${i} / columns ${columns} = ${i / columns}`);

  // round down the result of i / columns
  console.log(`Round down i / columns = ${Math.floor(i / columns)}`);

  // now we can include any spacing between the frames
  if (spacing && spacing > 0) {
    x += spacing + ((spacing * i) % columns);
    y += spacing + spacing * Math.floor(i / columns);
  }
  // if (spacing && spacing > 0) {
  //   x += spacing + ((spacing * i) % columns);
  //   console.log(
  //     `x ${x} += spacing ${(x +=
  //       spacing)} + ((spacing * frame number)) % columns = ${(x +=
  //       spacing + ((spacing * i) % columns))}`
  //   );
  // }

  // push the x / y positions into the array
  positions.push([x, y]);
}

console.log(positions);

// Now! The filmstrip() function takes the positions array
// as one of its arguments. The arguments in order are:
// image : path to the image. Use the assets loader if available.
// positions : the positions array
// frame width
// frame height
// spacing : between each column and row : default is 0
// function filmstrip(image, positions, frameWidth, FrameHeight, spacing = 0)

// Then! The filmstrip() function returns the animation frames
// using the frame() function:

/* function filmstrip(image, positions, frameWidth, FrameHeight, spacing = 0) {

   --- The above code here ---

   // the frames function must be imported from importer.js
   return frames(image, positions, frameWidth, frameHeight);

}
*/

// Just for info
// return the decimal part of a remainder
// console.log(`${7.75 % 3.75}`);
