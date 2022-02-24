/*
The trick to creating believable reverb is that you combine two sounds together.
The first sound is your original sound, without reverb. The second is a special recording of a neutral sound
(white noise) in the kind of acoustic space that you want to simulate: for example, a room, cave, or theatre.
These special recordings are called impulse response recordings. You then blend these two sounds together
using an audio processor called a convolver. The convolver takes your original sound, compares it to the
impulse response recording, and combines the two sounds together. The result is realistic reverb which
sounds like the space that you’re trying to simulate. 
*/

function impulseResponse(duration = 2, decay = 2, reverse = false) {
  //Var to store  the length of the buffer
  //AudioContext's default sample rate is 44100
  let length = actx.sampleRate * duration;

  // create an audio buffer (an empty sound container)
  // to store the reverb effect
  let impulse = actx.createBuffer(2, length, actx.sampleRate);

  // Use getChannelData to initialise empty arrys to
  // store sound data for
  let left = impulse.getChannelData(0),
    right = impulse.getChannelData(1);

  // loop through each sample frame and fill the
  // channel with random noise
  for (let i = 0; i < length; i++) {
    // if reverse is true apply the reverse effect
    let n;
    if (reverse) {
      n = length - i;
    } else {
      n = i;
    }

    // fill the left and right channels with random
    // white noise that decays exponentially
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);

    right[i] = Math.random() * 2 * Math.pow(1 - n / length, decay);
  }

  // return  the impulse
  return impulse;
}

// the impulseResponse function returns a buffer, which
// is a model of the reverb effect we want to apply to
// our sound.

// the context
let actx = new AudioContext();

//var to store the sound
let soundBuffer;

let xhr = new XMLHttpRequest();
xhr.open("GET", "../audio/Cm.wav", true);
xhr.responseType = "arraybuffer";
xhr.send();
xhr.addEventListener("load", loadHandler, false);

function loadHandler(event) {
  // decode the sound
  actx.decodeAudioData(
    xhr.response, //the array buffer
    (buffer) => {
      soundBuffer = buffer;
    },
    (error) => {
      throw new Error(`The sound could not be decoded ${error}`);
    }
  );
}

window.addEventListener("keydown", keydownHandler, false);

function keydownHandler(event) {
  switch (event.keyCode) {
    case 49:
      {
        if (soundBuffer) {
          // play with reverb
          let soundNode = actx.createBufferSource();
          // To use it, create a convolver node. This audio
          // processor blends ordinary sounds with impulse
          // responses to create the reverb effect.
          let convolverNode = actx.createConvolver();
          // then set the impulse response to the convolver's
          // own buffer:
          convolverNode.buffer = impulseResponse(2, 4, false);
          soundNode.buffer = soundBuffer;
          // Volume node
          let volumeNode = actx.createGain();
          volumeNode.gain.value = 5;

          // ***  un-comment these three lines to restore original
          // soundNode.connect(convolverNode);
          // convolverNode.connect(actx.destination);
          // soundNode.start(actx.currentTime);

          // comment this lot out if you un-comment the above
          // we just added a volumeNode to control volume
          soundNode.connect(volumeNode);
          volumeNode.connect(convolverNode);
          convolverNode.connect(actx.destination);
          soundNode.start(actx.currentTime);
        }
      }
      break;
    case 50: {
      if (soundBuffer) {
        // play as is
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;
        soundNode.connect(actx.destination);
        soundNode.start();
      }
    }
  }
}

// let soundNode = actx.createBufferSource();
// soundNode.buffer = soundBuffer;

// To use it, create a convolver node. This audio
// processor blends ordinary sounds with impulse
// responses to create the reverb effect.

// let convolverNode = actx.createConvolver();

// // then set the impulse response to the convolver's
// // own buffer:
// convolverNode.buffer = impulseResponse(2, 2, false);

// // and finally, connect the convolverNode to the sound chain.
// soundNode.connect(convolverNode);
// convolverNode.connect(destination);
