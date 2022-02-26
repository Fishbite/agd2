import { keyboard } from "../lib/interactive.js";
let actx = new AudioContext();

function playNote(frequency, decay = 1, type = "sine") {
  let oscillator = actx.createOscillator();
  let volume = actx.createGain();
  //   volume.gain.value = 1;

  oscillator.connect(volume);
  volume.connect(actx.destination);

  // set the  oscillator's wave type
  oscillator.type = type;

  // set the  note value
  oscillator.frequency.value = frequency;

  // fade the sounds out
  // Start at vol level 1, fade to vol level 0
  volume.gain.linearRampToValueAtTime(1, actx.currentTime);
  volume.gain.linearRampToValueAtTime(0, actx.currentTime + decay);

  // start now
  oscillator.start(actx.currentTime);
}

playNote(260.63, 1, "sine");

// Note: linearRampToValueAtTime lets you change any node value
// over a period of time in a linear way.
// Use exponentialRampToValueAtTime to change gradually and
// fall off quickly - Look at how too set that up.

// ****** Let's Play Some Notes :-) ****** \\
// Remember, the keyboard function creates event listeners for us.
// So, just set the keys up
let one = keyboard(49),
  two = keyboard(50),
  three = keyboard(51),
  four = keyboard(52),
  five = keyboard(53),
  six = keyboard(54),
  seven = keyboard(55);

// Define some musical note values
let C = 261.63,
  D = 293.66,
  E = 329.63,
  F = 349.23,
  G = 392,
  A = 440,
  B = 493.88;

// Set the press method for each key
one.press = () => {
  playNote(C, 2);
};
two.press = () => {
  playNote(D, 2);
};
three.press = () => {
  playNote(E, 2);
};
four.press = () => {
  playNote(F, 2);
};
five.press = () => {
  playNote(G, 2);
};
six.press = () => {
  playNote(A, 2);
};
seven.press = () => {
  playNote(B, 2);
};
