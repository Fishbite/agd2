console.log("Coolio!");

const audioCtx = new AudioContext();

// grab check boxes from the interface
const pads = document.querySelectorAll(".pads");
// console.log(pads);
const allPadButtons = document.querySelectorAll("#tracks button");
// console.log(allPadButtons);

// switch aria attribute on click
allPadButtons.forEach((el) => {
  el.addEventListener(
    "click",
    () => {
      if (el.getAttribute("aria-checked") === "false") {
        el.setAttribute("aria-checked", "true");
      } else {
        el.setAttribute("aria-checked", "false");
      }
    },
    false
  );
});

/* ****** The Periodic Wave ****** */
// Instead of using sine, triangle, square or saw wave
// we'll create our own type of wave using the values
// in the wave table that we have from MDN wavetable.js
import { wavetable } from "./waveTable.js";
const wave = audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);
// console.log(wave);

/* ****** The Oscilllator ****** */
// We pass in a time parameter to the function here, which we'll
// use later to schedule the sweep.
let sweepLength = 2;
function playSweep(time) {
  const osc = audioCtx.createOscillator();
  osc.setPeriodicWave(wave);
  osc.frequency.value = 440;

  // Our sweep envelope
  let sweepEnv = audioCtx.createGain();
  sweepEnv.gain.cancelScheduledValues(time);
  sweepEnv.gain.setValueAtTime(0, time);
  // set the attack
  sweepEnv.gain.linearRampToValueAtTime(1, time + attackTime);
  // set the release
  sweepEnv.gain.linearRampToValueAtTime(0, time + sweepLength - releaseTime);

  osc.connect(sweepEnv).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + sweepLength);
}

/* ****** A Simple Amplitude Envelope ****** */
// The user can control the 'attack' and 'release' of the
// envelope using the range controls on the interface
let attackTime = 0.2;
const attackControl = document.querySelector("#attack");
attackControl.addEventListener(
  "input",
  function (ev) {
    attackTime = Number(ev.target.value);
  },
  false
);

let releaseTime = 0.5;
const releaseControl = document.querySelector("#release");
releaseControl.addEventListener(
  "input",
  function (ev) {
    releaseTime = Number(ev.target.value);
  },
  false
);

/* ***** The Pulse ****** */
// low frequency oscillator modulation
// Using the default sine wave instead of a bespoke wave
// as used in our playSweep oscillator
// we create the pulse sound using an oscillator modulated
// by second oscillator
// Expose the frequency and frequency modulation
let pulseHz = 880;
const hzControl = document.querySelector("#hz");
hzControl.addEventListener(
  "input",
  (ev) => {
    pulseHz = Number(ev.target.value);
  },
  false
);

let lfoHz = 30;
const lfoControl = document.querySelector(
  "input",
  (ev) => {
    lfoHz = Number(ev.target.value);
  },
  false
);

// The playPulse function
const pulseTime = 1;
function playPulse(time) {
  // create our first lfo with a sine wave
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = pulseHz;

  // now create a gain node. We will oscillate the gain value
  // with our second low frequency oscillator
  const amp = audioCtx.createGain();
  amp.gain.value = 1;

  // creat a second 'square' wave (or pulse) oscillator to alter
  // the amplification of our first sine wave
  const lfo = audioCtx.createOscillator();
  lfo.type = "square";
  lfo.frequency.value = lfoHz;

  // Connect the graph and start both oscillators
  lfo.connect(amp.gain);
  osc.connect(amp).connect(audioCtx.destination);
  lfo.start();
  osc.start(time);
  osc.stop(time + pulseTime);
}

// Expose noteDuration and band frequency
let noiseDuration = 1;
const durControl = document.querySelector("#duration");
durControl.addEventListener(
  "input",
  (ev) => {
    noiseDuration = Number(ev.target.value);
  },
  false
);

let bandHz = 1000;
const bandControl = document.querySelector("#band");
bandControl.addEventListener(
  "input",
  (ev) => {
    bandHz = Number(ev.target.value);
  },
  false
);

// Random noise buffer with biquad filter
function playNoise(time) {
  // calcualte the size of the buffer
  // Set the time of the note???
  const bufferSize = audioCtx.sampleRate * noiseDuration;
  // Create an empty buffer
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  // Get the data
  const data = buffer.getChannelData(0);

  // Fill the buffer with random noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  // Creat a buffer source for our created data
  // A node that can use the buffer as a source
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  // Add a biquad filter into the mix. This will
  // cut off the high frequencies and some of the lower ones
  // using a bandpass biquad filter
  const bandpass = audioCtx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = bandHz;

  // connect our graph
  noise.connect(bandpass).connect(audioCtx.destination);
  noise.start(time);
}

// Loading~~~~~~~~~~~~~~~~~~~~~~~~~~
// Fetch the audio file and decode the data
async function getFile(audioCtx, filepath) {
  // Use the await operator to ensure that we can only run
  // subsequent code when it has finished executing;
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();

  // Callback function added as second param for Safari only!!!
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer, function () {
    return;
  });
  return audioBuffer;
}

// Expose the rate controls
let playbackRate = 1;
const rateControl = document.querySelector("#rate");
rateControl.addEventListener(
  "input",
  (ev) => {
    playbackRate = Number(ev.target.value);
  },
  false
);

// Create a buffer, fill it with data and play
function playSample(audioCtx, audioBuffer, time) {
  const sampleSource = audioCtx.createBufferSource();
  sampleSource.buffer = audioBuffer;
  sampleSource.playbackRate.value = playbackRate;
  sampleSource.connect(audioCtx.destination);
  sampleSource.start(time);
  return sampleSource;
}

// An async function to set up the sample. We can combine
// the 2 async functions in a promise pattern to perform
// further actions when this file is loaded and buffered
async function setupSample() {
  const filepath = "../audio/test.wav";

  // here we await the async/promise that is 'getFile'
  // To be able to use the 'this' keyword we need to be
  // within an async function
  const sample = await getFile(audioCtx, filepath);
  return sample;
}

// Scheduling~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The best way to ensure our sounds play on time is to
// set up a scheduling system, whereby we look ahead at
// when the notes are going to play and push them into
// a queue. We can start them at a precise time with the
// currentTime property and also take into account
// any changes

// Setup our default BPM controllable via a range input
let tempo = 60.0;
const bpmCcontrol = document.querySelector("#bpm");
const bpmValEl = document.querySelector("#bpmval");

bpmCcontrol.addEventListener(
  "input",
  (ev) => {
    tempo = Number(ev.target.value);
    bpmValEl.innerText = tempo;
  },
  false
);

// How frequetly to call the scheduling function in millisecs
const lookAhead = 25.0;
// How far ahead to schedule audio in seconds
const scheduleAheadTime = 0.1;

let currentNote = 0; // the note we are currently playing
let nextNoteTime = 0.0; // when the next note is due
function nextNote() {
  const secondsPerBeat = 60.0 / tempo;

  // add beat the length to the last beat time
  nextNoteTime += secondsPerBeat;

  // Advance the beat and wrap to zero at 4
  currentNote++;
  if (currentNote === 4) {
    currentNote = 0;
  }
}

// Create a queue for the notes that are to be played with
// the current time that we want to play
const notesInQueue = [];
let dtmf;

// Add the functionality to play the notes using the
// functions we have previously created
function scheduleNote(beatNumber, time) {
  // push the note onto the queue, even if we're not playing
  notesInQueue.push({ note: beatNumber, time: time });
  console.log(beatNumber, time);

  if (
    pads[0]
      .querySelectorAll("button")
      [beatNumber].getAttribute("aria-checked") === "true"
  ) {
    playSweep(time);
  }

  if (
    pads[1]
      .querySelectorAll("button")
      [beatNumber].getAttribute("aria-checked") === "true"
  ) {
    playPulse(time);
  }

  if (
    pads[2]
      .querySelectorAll("button")
      [beatNumber].getAttribute("aria-checked") === "true"
  ) {
    playNoise(time);
  }

  if (
    pads[3]
      .querySelectorAll("button")
      [beatNumber].getAttribute("aria-checked") === "true"
  ) {
    playSample(audioCtx, dtmf, time);
  }
}

let timerID;
function scheduler() {
  // while there are notes that will need to play before the
  // next interval, schedule them and advance the pointer
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleNote(currentNote, nextNoteTime);
    nextNote();
  }
  timerID = window.setTimeout(scheduler, lookAhead);
}

// A draw function to update the UI so we can see when the
// beat progresses
let lastNoteDrawn = 3;
function draw() {
  let drawNote = lastNoteDrawn;
  const currentTime = audioCtx.currentTime;

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    drawNote = notesInQueue[0].note;
    notesInQueue.splice(0, 1); // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (lastNoteDrawn !== drawNote) {
    pads.forEach((el) => {
      el.children[lastNoteDrawn].style.borderColor = "hsla(0, 0%, 10%, 1)";
      el.children[drawNote].style.borderColor = "hsla(49, 99%, 50%, 1)";
    });

    lastNoteDrawn = drawNote;
  }
  // set up to draw again
  requestAnimationFrame(draw);
}

// When the sample has loaded, allow play
const loadingEl = document.querySelector(".loading");
const playButton = document.querySelector("[data-playing]");
let isPlaying = false;
setupSample().then((sample) => {
  loadingEl.style.display = "none";

  dtmf = sample; // to be used in our playSample function

  playButton.addEventListener("click", (ev) => {
    isPlaying = !isPlaying;

    if (isPlaying) {
      // start playing

      // check if context is in suspended state (autoplay policy)
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      currentNote = 0;
      nextNoteTime = audioCtx.currentTime;
      scheduler(); // start scheduling
      requestAnimationFrame(draw); // start the drawing loop
      ev.target.dataset.playing = "true";
    } else {
      window.clearTimeout(timerID);
      ev.target.dataset.playing = "false";
    }
  });
});
