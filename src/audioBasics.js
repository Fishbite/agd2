console.log("OK!!!");
// create an audio context
let actx = new AudioContext();

// create a variable to hold the sound we are going to load
let soundBuffer;

// if we define a panNode outside of our keyDownHandler
// we can manipulate the panNode.pan.value in our loop
let panNode = actx.createStereoPanner();

/* ****** load the sound ******/
//a. Use an XMLHttpRequest object to load the sound
let xhr = new XMLHttpRequest();

//b. Set properties for the file we want to load.
//Use GET and set the path to the sound file.
//`true` means that the file will load asynchronously and will create
//an event when the file has finished loading
xhr.open("GET", "../audio/test.wav", true);

//c. Set the `responseType`, which is the file format we're expecting to
//load. Sound files should be loaded as binary files, so the `responseType`
//needs to be `arraybuffer`
xhr.responseType = "arraybuffer";

// load the sound into the programm
xhr.send();

//e. Create a `loadHandler` that runs when the sound has been loaded
xhr.addEventListener("load", loadHandler, false);

function loadHandler(event) {
  //f. Decode the audio file and store it in the `soundBuffer`
  //variable. The `buffer` is the raw audio data
  actx.decodeAudioData(
    xhr.response,
    (buffer) => {
      //g. Copy the audio file into the `soundBuffer` variable
      soundBuffer = buffer;
    },

    //Optionally throw an error if the audio can't be decoded
    (error) => {
      throw new Error(`audio could not be decoded ${error}`);
    }
  );
}

// play a sound when the key is pressed: #1
window.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
  switch (event.keyCode) {
    case 49:
      if (soundBuffer) {
        //4. Play the sound
        //a. Create a new `soundNode` and tell it to use the
        //sound that we loaded as its audio source
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;

        //b. Connect the sound to the destination.
        //(There are no effects in this example.)
        soundNode.connect(actx.destination);

        //c. Finally, play the sound. Use the `start` method to
        //play the sound “right now”, which is the audio context’s `currentTime`
        // Do: soundNode.start(actx.currentTime + 2); to add a 2 sec' delay to the start
        soundNode.start(actx.currentTime);
      }
      break;
    // The soundNode, volumeNode, panNode, destination & loop chain
    case 50:
      if (soundBuffer) {
        let soundNode = actx.createBufferSource();
        soundNode.buffer = soundBuffer;

        // create a volume node
        let volumeNode = actx.createGain();
        // create a pan node. Done outside of this handler!!!
        // let panNode = actx.createStereoPanner();

        // connect the Nodes in a chain:
        soundNode.connect(volumeNode);
        volumeNode.connect(panNode);
        panNode.connect(actx.destination);

        // set the volumeNode level:
        volumeNode.gain.value = 0.75;

        // set the panNode value:
        // -1 = full left speaker, 1 = full right speaker
        panNode.pan.value = -1;
        // while (panNode.pan.value < 1) panNode.pan.value += 0.001;

        // do you wanna loop the sound?
        soundNode.loop = false;

        // play the sound
        soundNode.start(actx.currentTime);
      }
  }
}

loop();

function loop() {
  requestAnimationFrame(loop);

  // pan the sound from left (-1) to right (+1)
  panNode.pan.value += 0.01;
}
/* ■Tip A lternatively, you can make a sound play immediately by supplying the start method with a value of 0,
this way: start(0). That’s because any value that’s less than the currentTime will cause the audio context to
play the sound immediately. You can use whichever style you prefer. */

// Note: These are the minimum four lines of code
// that we have to run to play the sound:

/* 
    let soundNode = actx.createBufferSource();
    soundNode.buffer = soundBuffer;
    soundNode.connect(actx.destination);
    soundNode.start(actx.currentTime); 
*/

/* ****** Volume, Panning & Looping ****** */
// To change the volume and panning, create a volume and pan node:

// let volumeNode = actx.createGain();

// let panNode = actx.createStereoPanner();

// now connect these nodes to the  sound node and destination
// note: these need to be within the scope of each variable
/*
soundNode.connect(volumeNode);
volumeNode.connect(panNode);
panNode.connect(actx.destination);
*/

// how to make the above work:
// create another case in the keyDown event listener and include the connections above.
