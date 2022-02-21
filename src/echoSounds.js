import { keyboard } from "../lib/interactive.js";

/* 
            ****** Creating an Echo ******

    Ok! If you want to create an echo effect, you will have to
    build it yourself.

    Basically, you need to add a closed loop set of nodes in the
    connection chain that contains delay nodes and a feedback node.

    The delay node pauses the sound and the feedback node reduces
    the volume level of the sound.

    The loop looks like this: delay > feedback > delay
*/

// The context
let actx = new AudioContext();

// Var to hold the sound
let soundBuffer;

// ****** Load the sound ****** \\
let xhr = new XMLHttpRequest();

// GET the sound file
xhr.open("GET", "../audio/test.wav", true);
// The response type
xhr.responseType = "arraybuffer";
// load the sound into the program
xhr.send();

xhr.addEventListener("load", loadHandler, false);

// decode the sound in the load handler
function loadHandler(event) {
  actx.decodeAudioData(
    xhr.response, // (this is the array buffer)
    (buffer) => {
      soundBuffer = buffer; // decoded file set to soundBuffer
      // console.log(soundBuffer);
    },
    (error) => {
      throw new Error(`Audio could not be decoded ${error}`);
    }
  );
}

window.addEventListener("keydown", keydownHandler, false);

function keydownHandler(event) {
  switch (event.keyCode) {
    case 49: // play the sound as is:
      if (soundBuffer) {
        // create the audioBufferSourceNode
        let soundNode = actx.createBufferSource();
        // fill the buffer with the sound
        soundNode.buffer = soundBuffer;
        // connect to the speakers
        soundNode.connect(actx.destination);
        // play the sound immediately
        soundNode.start(actx.currentTime);
      }
      break;
    case 50: // create an echo effect
      if (soundBuffer) {
        console.log(soundBuffer);
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;
        // create a delay node
        let delayNode = actx.createDelay();
        delayNode.delayTime.value = 0.25; // set the delay of the next echo
        // the feedbackNode
        let feedbackNode = actx.createGain();
        feedbackNode.gain.value = 0.75; // reduce the volume on each echo

        // create the delay > feedback loop
        delayNode.connect(feedbackNode);
        feedbackNode.connect(delayNode);

        // connect the source to the destination to play
        // the first instance of the sound at full volume
        soundNode.connect(actx.destination);

        // capture the source and send it to the delay loop
        soundNode.connect(delayNode);

        // then connect the delay to the destination
        delayNode.connect(actx.destination);

        // don't forget to start the sound
        soundNode.start(actx.currentTime);

        // Note: The API runtime (the browser) will
        // take care of removing  sounds with a
        // volume less than zero, so, we don't
        // have to manually remove sounds that cann't
        // be heard any more.
      }
      break;
    case 51: // A more organic sounding echo
      if (soundBuffer) {
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;

        // create a delay node
        let delayNode = actx.createDelay();
        delayNode.delayTime.value = 0.25;

        // create a feedback node
        let feedbackNode = actx.createGain();
        feedbackNode.gain.value = 0.75;

        // filter out and frequencies above 1000Hz
        // using a biquad filter
        let filterNode = actx.createBiquadFilter();
        filterNode.frequency.value = 3500;

        // add the filter to th delay loop
        delayNode.connect(feedbackNode);
        feedbackNode.connect(filterNode);
        filterNode.connect(delayNode);

        soundNode.connect(actx.destination);
        soundNode.connect(delayNode);
        delayNode.connect(actx.destination);
        // start the sound now
        soundNode.start(actx.currentTime);
      }
      break;
    case 52: // playing with the biquad filter's detune property
      /* QUOTE:
            Tip Biquad filters also have a fun property called detune, which lets you change the pitch of the source sound. Set it to a value in cents (percentage of a semitone) to change the pitch by that amount. An entire octave
            (12 semitones) is 1200 cents.
*/
      if (soundBuffer) {
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;

        // create a delay node
        let delayNode = actx.createDelay();
        delayNode.delayTime.value = 0.25;

        // create a feedback node
        let feedbackNode = actx.createGain();
        feedbackNode.gain.value = 0.75;

        // filter out and frequencies above 1000Hz
        // using a biquad filter
        let filterNode = actx.createBiquadFilter();
        filterNode.frequency.value = 3500;
        filterNode.detune.value = -1200;

        // add the filter to th delay loop
        delayNode.connect(feedbackNode);
        feedbackNode.connect(filterNode);
        filterNode.connect(delayNode);

        soundNode.connect(actx.destination);
        soundNode.connect(delayNode);
        delayNode.connect(actx.destination);
        // start the sound now
        soundNode.start(actx.currentTime);
      }
  }
}
