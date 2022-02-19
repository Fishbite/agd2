// Sound functions to handle the web audio API

// Create the audio context
let actx = new AudioContext();

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

    // load the sound
    this.load();
  }

  // the sound object's methods
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

    // will the sound loop? This can be true or false
    this.soundNode.loop = this.loop;

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

// How to use the sound class to make a sound object.
// Initialise the object with the source path and an optional load handler
let music = makeSound("../audio/music.wav", setupMusic);

// Use the setup to set any of the sounds props and what
// will trigger the sound to play. e.g. a key press:
import { keyboard } from "../lib/interactive.js";

function setupMusic() {
  // loop
  music.loop = true;

  // pan
  music.pan = -0;

  // volume
  music.volume = 0.75;

  // Capture  the keyboard events
  let a = keyboard(65),
    b = keyboard(66),
    c = keyboard(67),
    d = keyboard(68);

  // use the key's press method to control and play the sound
  a.press = () => {
    if (!music.playing) music.play();
    console.log("music is playing");
    music.pan = 0;
  };

  b.press = () => {
    music.pause();
    console.log("music is paused");
  };

  c.press = () => {
    music.restart();
    console.log("music has restarted");
  };

  d.press = () => {
    music.playFrom(2);
    console.log("music starting from a different startpoint");
    music.pan = -0.75; // you can do this :o)
  };
}
