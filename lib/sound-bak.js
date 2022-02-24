// Sound functions to handle the web audio API

// Create the audio context
let actx = new AudioContext();

// This code outputs the actual destination of the sound: speakers
console.log(actx.destination.channelInterpretation);

// The Sound class
class Sound {
  constructor(source, loadHandler) {
    // assign the source and loadHandler to this object
    (this.source = source), (this.loadHandler = loadHandler);

    // set the default set the default properties
    this.actx = actx;
    this.panNode = this.actx.createStereoPanner();
    this.volumeNode = this.actx.createGain();
    this.soundNode = null;
    this.buffer = null;
    this.loop = false;
    this.playing = false;

    // values for the pan and volumne getter and setters
    this.panValue = 0;
    this.volumeValue = 1;

    // values to help to track and set the start and pause values
    this.startTime = 0;
    this.startOffset = 0;

    // additional special effects
    // playback speed: 1 = normal speed
    this.playbackRate = 1;

    // Echo effect nodes
    this.delayNode = this.actx.createDelay();
    this.feedbackNode = this.actx.createGain();
    this.filterNode = this.actx.createBiquadFilter();

    // Reverb effect node
    this.convolverNode = this.actx.createConvolver();

    // Echo Properties
    this.echo = false;
    this.delayValue = 0.3;
    this.feedbackValue = 0.3;
    this.filterValue = 0; // zero = no filter effect

    // Reverb properties
    this.reverb = false;
    this.reverbImpulse = null;

    // load the sound
    this.load();
  }

  // the `Sound` object's methods
  load() {
    // Use xhr to load the sound file
    let xhr = new XMLHttpRequest();
    xhr.open("GET", this.source, true);
    xhr.responseType = "arraybuffer";
    xhr.addEventListener("load", () => {
      // decode the sound and store a reference to the buffer
      this.actx.decodeAudioData(
        xhr.response,
        (buffer) => {
          this.buffer = buffer;
          this.hasLoaded = true;

          // this next bit is optional but important.
          // If you have a load manager, call it here, so that
          // the sound is registered as loaded
          if (this.loadHandler) {
            this.loadHandler();
          }
        },

        // Throw an error if the sound can't be loaded
        (error) => {
          throw new Error(`Audio could not be decoded ${error}`);
        }
      );
    });

    // send the request to load the file
    xhr.send();
  }

  // Use setEcho like this:
  // theSound.setEcho(delayValue, feedbackValue, optional feedbackValue)
  // i.e. theSound.setEcho(0.2, 0.5, 1000);
  // to turn the echo effect off at some point:
  // theSound.echo = false;
  setEcho(delayValue = 0.3, feedbackValue = 0.3, filterValue = 0) {
    this.delayValue = delayValue;
    this.feedbackValue = feedbackValue;
    this.filterValue = filterValue;
    this.echo = true;
  }

  setReverb(duration = 2, decay = 2, reverse = false) {
    this.reverbImpulse = impulseResponse(duration, decay, reverse);
    this.reverb = true;
  }

  play() {
    // set the start time, it will be zero when the first sound starts
    this.startTime = this.actx.currentTime;

    // create a sound node
    this.soundNode = this.actx.createBufferSource();

    // set the sound node's buffer property to the loaded sound
    this.soundNode.buffer = this.buffer;

    // create the node connection chain
    this.soundNode.connect(this.volumeNode);
    this.volumeNode.connect(this.panNode);
    this.panNode.connect(this.actx.destination);

    // Optional Echo
    if (this.echo) {
      // Set the values
      this.feeedbackNode.gain.value = this.feedbackValue;
      this.delayNode.delayTime = this.delayValue;
      this.filterNode.frequency.value = this.filterValue;

      // The delay loop with optional filtering
      this.delayNode.connect(this.feedbackNode);
      if (this.filterValue > 0) {
        this.feedbackNode.connect(this.filterNode);
        this.filterNode.connect(this.delayNode);
      } else {
        this.feedbackNode.connect(this.delayNode);
      }

      // Capture the sound from the main node chain, send it to
      // the delay loop and send the final echo to the panNode,
      // which will then route it to the destination node
      this.volumeNode.connect(this.delayNode);
      this.delayNode.connect(this.panNode);
    }

    // will the sound loop? This can be true or false
    this.soundNode.loop = this.loop;

    // Set the sound buffer source's `playbackRate.value`
    this.soundNode.playbackRate.value = this.playbackRate;

    // Finally, use the start() method to play the sound.
    // The start time will be zero or,
    // a later time if the sound was paused
    this.soundNode.start(
      this.startTime,
      this.startOffset % this.buffer.duration
    );

    // Set playing to true to help control
    // the pause and restart methods
    this.playing = true;
  }

  pause() {
    // Pause the sound if its playing and calculate
    // the startOffset to save the current position
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
      this.startOffset += this.actx.currentTime - this.startTime;
      this.playing = false;
    }
  }

  restart() {
    // Stop the sound if its playing, reset the start and offset times,
    // then call the play method again
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
    }
    this.startOffset = 0;
    this.play();
  }

  playFrom(value) {
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
    }

    this.startOffset = value;
    this.play();
  }

  stop() {
    if (this.playing) {
      this.soundNode.stop(this.actx.currentTime);
    }
    this.startOffset = 0;
    this.playing = false;
  }

  // volume and pan getters and setters
  get volume() {
    return this.volumeValue;
  }

  set volume(value) {
    this.volumeNode.gain.value = value;
    this.volumeValue = value;
  }

  get pan() {
    return this.panNode.pan.value;
  }

  set pan(value) {
    this.panNode.pan.value = value;
  }
}

// A high level wrapper to keep our general API consistent and flexible
export function makeSound(source, loadHandler) {
  return new Sound(source, loadHandler);
}

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

    // fille the left and right channels with random
    // white noise that decays exponentially
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);

    right[i] = Math.random() * 2 * Math.pow(1 - n / length, decay);
  }

  // return  the impulse
  return impulse;
}
