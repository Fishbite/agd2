console.log("Wicked Noises");

// Don't forget to create the context!
let actx = new AudioContext();

// ****** Function to Create Sound Effects ****** \\
// function soundEffect(
//   frequencyValue,
//   attack = 0,
//   decay = 1,
//   type = "sine",
//   volumeValue = 1,
//   panValue = 0,
//   wait = 0,
//   pitchBendAmount = 0,
//   reverse = false,
//   randomValue = 0,
//   dissonance = 0,
//   echo = undefined,
//   reverb = undefined
// ) {
//   // Create and connect Oscillator, gain and pan nodes
//   // and connect them to the destination
//   let oscillator = actx.createOscillator(),
//     volume = actx.createGain(),
//     pan = actx.createStereoPanner();

//   oscillator.connect(volume);
//   volume.connect(pan);
//   pan.connect(actx.destination);

//   // Set the values
//   volume.gain.value = volumeValue;
//   pan.pan.value = panValue;
//   oscillator.type = type;

//   // Optionally randomize the pitch
//   // The pitch will be above or below the target frequency
//   let frequency;
//   let randomInt = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1) + min);
//   };

//   if (randomValue > 0) {
//     frequency = randomInt(
//       frequencyValue - randomValue / 2,
//       frequencyValue + randomValue / 2
//     );
//   } else {
//     frequency = frequencyValue;
//   }

//   oscillator.frequency.value = frequency;

//   // Apply Effects
//   if (attack > 0) fadeIn(volume);
//   if (decay > 0) fadeOut(volume);
//   if (pitchBendAmount > 0) pitchBend(oscillator);
//   if (echo) addEcho(volume);
//   if (reverb) addReverb(volume);
//   if (dissonance > 0) addDissonance();

//   // play the sound
//   play(oscillator);

//   // ****** Helper functions ****** \\

//   // Reverb
//   function addReverb(volumeNode) {
//     let convolver = actx.createConvolver();
//     convolver.buffer = impulseResponse(reverb[0], reverb[1], reverb[2]);
//     volumeNode.connect(convolver);
//     convolver.connect(pan);
//   }

//   // Echo
//   function addEcho(volumeNode) {
//     // The nodes required for an echo effect
//     let feedback = actx.createGain(),
//       delay = actx.createDelay(),
//       filter = actx.createBiquadFilter();

//     // Set their values:
//     // delay time, feedback time, filter frequency
//     delay.delayTime.value = echo[0];
//     feedback.gain.value = echo[1];
//     if (echo[2]) filter.frequency.value = echo[2];

//     // create the delay / feedback loop
//     // with optionsl filtering
//     delay.connect(feedback);
//     if (echo[2]) {
//       feedback.connect(filter);
//       filter.connect(delay);
//     } else {
//       feedback.connect(delay);
//     }

//     // Connect the delay loop to the oscillator's volume
//     // node and then to the destination
//     volumeNode.connect(delay);

//     // Connect the delay loop to the main sound chain's
//     //pan node
//     delay.connect(pan);
//   }

//   // Fade in (the sound's attack)
//   function fadeIn(volumeNode) {
//     // Set the volume to zero so we can fade in from silence
//     volumeNode.gain.value = 0;

//     volumeNode.gain.linearRampToValueAtTime(0, actx.currentTime + wait);
//     volumeNode.gain.linearRampToValueAtTime(
//       volumeValue,
//       actx.currentTime + wait + attack
//     );
//   }

//   // Fade out (the sound's decay)
//   function fadeOut(volumeNode) {
//     volumeNode.gain.linearRampToValueAtTime(
//       volumeValue,
//       actx.currentTime + attack + wait
//     );
//     volumeNode.gain.linearRampToValueAtTime(
//       0,
//       actx.currentTime + wait + attack + decay
//     );
//   }

//   // Pitch Bend
//   // Uses linearRampToValueAtTime to  bend the sound's
//   // frequency up or down
//   function pitchBend(oscillatorNode) {
//     // get the frequency of the current oscillator
//     let frequency = oscillatorNode.frequency.value;

//     // if reverse is true, make the sound drop in pitch.
//     // Useful for shooting sounds
//     if (!reverse) {
//       oscillatorNode.frequency.linearRampToValueAtTime(
//         frequency,
//         actx.currentTime + wait
//       );
//       oscillatorNode.frequency.linearRampToValueAtTime(
//         frequency - pitchBendAmount,
//         actx.currentTime + wait + attack + decay
//       );
//     }
//     // if reverse is true, make the note rise in pitch
//     // Useful for jumping sounds
//     else {
//       oscillatorNode.frequency.linearRampToValueAtTime(
//         frequency,
//         actx.currentTime + wait
//       );
//       oscillatorNode.frequency.linearRampToValueAtTime(
//         frequency + pitchBendAmount,
//         actx.currentTime + wait + attack + decay
//       );
//     }
//   }

//   // Dissonance
//   function addDissonance() {
//     // create two more oscillator and gain nodes
//     let d1 = actx.createOscillator(),
//       d2 = actx.createOscillator(),
//       d1Volume = actx.createGain(),
//       d2Volume = actx.createGain();

//     // Connect the oscillators to the gain and destination nodes
//     d1.connect(d1Volume);
//     d1Volume.connect(actx.destination);
//     d2.connect(d2Volume);
//     d2Volume.connect(actx.destination);

//     // Set the waveform to sawtooth for a harsh effect
//     d1.type = "sawtooth";
//     d1.type = "sawtooth";

//     // Make the two oscillators play at frequencies above
//     // and below the sound's frequency. Use whatever value
//     // was supplied by the dissonance argument
//     d1.frequency.value = frequency + dissonance;
//     d2.frequency.value = frequency + dissonance;

//     // Apply the effects to the gain and oscillator
//     // nodes to match the effects on the main sound
//     if (attack > 0) {
//       fadeIn(d1Volume);
//       fadeIn(d1Volume);
//     }

//     if (decay > 0) {
//       fadeOut(d1Volume);
//       fadeOut(d1Volume);
//     }

//     if (pitchBendAmount > 0) {
//       pitchBend(d1);
//       pitchBend(d2);
//     }

//     if (echo) {
//       addEcho(d1Volume);
//       addEcho(d2Volume);
//     }

//     if (reverb) {
//       addReverb(d1Volume);
//       addReverb(d2Volume);
//     }

//     // play the sounds
//     play(d1);
//     play(d2);
//   }

//   // The play function starts the oscillators
//   function play(oscillatorNode) {
//     oscillatorNode.start(actx.currentTime + wait);
//   }
// }

// crappy Expolsion

function soundEffect(
  frequencyValue,
  attack = 0,
  decay = 1,
  type = "sine",
  volumeValue = 1,
  panValue = 0,
  wait = 0,
  pitchBendAmount = 0,
  reverse = false,
  randomValue = 0,
  dissonance = 0,
  echo = undefined,
  reverb = undefined
) {
  //Create oscillator, gain and pan nodes, and connect them
  //together to the destination
  let oscillator = actx.createOscillator(),
    volume = actx.createGain(),
    pan = actx.createStereoPanner();

  oscillator.connect(volume);
  volume.connect(pan);
  pan.connect(actx.destination);

  //Set the supplied values
  volume.gain.value = volumeValue;
  pan.pan.value = panValue;
  oscillator.type = type;

  //Optionally randomize the pitch. If the `randomValue` is greater
  //than zero, a random pitch is selected that's within the range
  //specified by `frequencyValue`. The random pitch will be either
  //above or below the target frequency.
  let frequency;
  let randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  if (randomValue > 0) {
    frequency = randomInt(
      frequencyValue - randomValue / 2,
      frequencyValue + randomValue / 2
    );
  } else {
    frequency = frequencyValue;
  }
  oscillator.frequency.value = frequency;

  //Apply effects
  if (attack > 0) fadeIn(volume);
  if (decay > 0) fadeOut(volume);
  if (pitchBendAmount > 0) pitchBend(oscillator);
  if (echo) addEcho(volume);
  if (reverb) addReverb(volume);
  if (dissonance > 0) addDissonance();

  //Play the sound
  play(oscillator);

  //The helper functions:

  //Reverb
  function addReverb(volumeNode) {
    let convolver = actx.createConvolver();
    convolver.buffer = impulseResponse(reverb[0], reverb[1], reverb[2]);
    volumeNode.connect(convolver);
    convolver.connect(pan);
  }

  //Echo
  function addEcho(volumeNode) {
    //Create the nodes
    let feedback = actx.createGain(),
      delay = actx.createDelay(),
      filter = actx.createBiquadFilter();

    //Set their values (delay time, feedback time and filter frequency)
    delay.delayTime.value = echo[0];
    feedback.gain.value = echo[1];
    if (echo[2]) filter.frequency.value = echo[2];

    //Create the delay feedback loop, with
    //optional filtering
    delay.connect(feedback);
    if (echo[2]) {
      feedback.connect(filter);
      filter.connect(delay);
    } else {
      feedback.connect(delay);
    }

    //Connect the delay loop to the oscillator's volume
    //node, and then to the destination
    volumeNode.connect(delay);

    //Connect the delay loop to the main sound chain's
    //pan node, so that the echo effect is directed to
    //the correct speaker
    delay.connect(pan);
  }

  //Fade in (the sound’s “attack”)
  function fadeIn(volumeNode) {
    //Set the volume to 0 so that you can fade in from silence
    volumeNode.gain.value = 0;

    volumeNode.gain.linearRampToValueAtTime(0, actx.currentTime + wait);
    volumeNode.gain.linearRampToValueAtTime(
      volumeValue,
      actx.currentTime + wait + attack
    );
  }

  //Fade out (the sound’s “decay”)
  function fadeOut(volumeNode) {
    volumeNode.gain.linearRampToValueAtTime(
      volumeValue,
      actx.currentTime + attack + wait
    );
    volumeNode.gain.linearRampToValueAtTime(
      0,
      actx.currentTime + wait + attack + decay
    );
  }

  //Pitch bend.
  //Uses `linearRampToValueAtTime` to bend the sound’s frequency up or down
  function pitchBend(oscillatorNode) {
    //Get the frequency of the current oscillator
    let frequency = oscillatorNode.frequency.value;

    //If `reverse` is true, make the sound drop in pitch.
    //(Useful for shooting sounds)
    if (!reverse) {
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency,
        actx.currentTime + wait
      );
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency - pitchBendAmount,
        actx.currentTime + wait + attack + decay
      );
    }

    //If `reverse` is false, make the note rise in pitch.
    //(Useful for jumping sounds)
    else {
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency,
        actx.currentTime + wait
      );
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency + pitchBendAmount,
        actx.currentTime + wait + attack + decay
      );
    }
  }

  //Dissonance
  function addDissonance() {
    //Create two more oscillators and gain nodes
    let d1 = actx.createOscillator(),
      d2 = actx.createOscillator(),
      d1Volume = actx.createGain(),
      d2Volume = actx.createGain();

    //Set the volume to the `volumeValue`
    d1Volume.gain.value = volumeValue;
    d2Volume.gain.value = volumeValue;

    //Connect the oscillators to the gain and destination nodes
    d1.connect(d1Volume);
    d1Volume.connect(actx.destination);
    d2.connect(d2Volume);
    d2Volume.connect(actx.destination);

    //Set the waveform to "sawtooth" for a harsh effect
    d1.type = "sawtooth";
    d2.type = "sawtooth";

    //Make the two oscillators play at frequencies above and
    //below the main sound's frequency. Use whatever value was
    //supplied by the `dissonance` argument
    d1.frequency.value = frequency + dissonance;
    d2.frequency.value = frequency - dissonance;

    //Apply effects to the gain and oscillator
    //nodes to match the effects on the main sound
    if (attack > 0) {
      fadeIn(d1Volume);
      fadeIn(d2Volume);
    }
    if (decay > 0) {
      fadeOut(d1Volume);
      fadeOut(d2Volume);
    }
    if (pitchBendAmount > 0) {
      pitchBend(d1);
      pitchBend(d2);
    }
    if (echo) {
      addEcho(d1Volume);
      addEcho(d2Volume);
    }
    if (reverb) {
      addReverb(d1Volume);
      addReverb(d2Volume);
    }

    //Play the sounds
    play(d1);
    play(d2);
  }

  //The `play` function that starts the oscillators
  function play(oscillatorNode) {
    oscillatorNode.start(actx.currentTime + wait);
  }
}

function explosionSound() {
  soundEffect(
    16, //frequency
    0, //attack
    1, //decay
    "sawtooth", //waveform
    1, //volume
    0, //pan
    0, //wait before playing
    0, //pitch bend amount
    false, //reverse
    0, //random pitch range
    50, //dissonance
    undefined, //echo array: [delay, feedback, filter]
    undefined //reverb array: [duration, decay, reverse?]
  );
}
/*  This creates a low-frequency rumble. The starting point for the explosion sound is to set the frequency
value extremely low: 16 Hz. It also has a harsh "sawtooth" waveform. But what makes it really work is
the dissonance value of 50. This adds two overtones, 50 Hz above and below the target frequency, which
interfere with each other and the main sound. */

function grittyAlarm() {
  soundEffect(
    16, //frequency
    0, //attack
    2, //decay
    "square", //waveform
    1, //volume
    0, //pan
    0, //wait before playing
    600, //pitch bend amount
    false, //reverse
    0, //random pitch range
    0, //dissonance
    undefined, //echo array: [delay, feedback, filter]
    undefined //reverb array: [duration, decay, reverse?]
  );
}
/*  This is a modified explosionSound!!! */

function softAlarm() {
  soundEffect(
    16, //frequency
    0, //attack
    2, //decay
    "sine", //waveform
    1, //volume
    0, //pan
    0, //wait before playing
    600, //pitch bend amount
    false, //reverse
    0, //random pitch range
    0, //dissonance
    undefined, //echo array: [delay, feedback, filter]
    undefined //reverb array: [duration, decay, reverse?]
  );
}

// Sound for jumps
function jumpSound() {
  soundEffect(
    523.25, //frequency
    0.05, //attack
    0.2, //decay
    "sine", //waveform
    3, //volume
    0.8, //pan
    0, //wait before playing
    600, //pitch bend amount
    true, //reverse
    100, //random pitch range
    0, //dissonance
    undefined, //echo array: [delay, feedback, filter]
    undefined //reverb array: [duration, decay, reverse?]
  );
}
/*  The jumpSound has an attack value of 0.05, which means there’s a very quick fade-in to the sound. It’s
so quick that you can’t really hear it, but it subtly softens the start of the sound. The reverse value is true,
which means that the pitch bends up instead of down. (This makes sense because jumping characters jump
upwards.) The randomValue is 100. That means the pitch will randomize within a range of 100 Hz around the
target frequency, so that the sound’s pitch will be slightly different every time. This adds organic interest to
the sound and makes the game world feel alive. */

//The shoot sound
function shootSound() {
  soundEffect(
    1046.5, //frequency
    0, //attack
    0.3, //decay
    "sawtooth", //waveform
    1, //Volume
    -0.8, //pan
    0, //wait before playing
    1200, //frequency bend amount
    false, //reverse bend
    0, //random frequency range
    25, //dissonance
    [0.2, 0.2, 2000], //echo array: [delay, feedback, filter]
    undefined //reverb array: [duration, decay, reverse?]
  );
}
/*  The "sawtooth" waveform setting gives the sound a biting harshness. The pitchBendAmount is 1200,
which means the sound’s frequency drops by 1200 Hz from start to finish. That makes it sound like every
laser from every science fiction movie you’ve ever seen. The dissonance value of 25 means that two extra
overtones are added to the sound at 25 Hz above and below the main frequency. Those extra overtones add
an edgy complexity to the tone.
Because the soundEffect function is wrapped in a custom shootSound function, you can play the effect
at any time in your application code, this way: */

//The shoot sound modified
function shootSoundMod() {
  soundEffect(
    1000, //frequency
    2, //attack
    0.3, //decay
    "sawtooth", //waveform
    1, //Volume
    -0.8, //pan
    0, //wait before playing
    1000, //frequency bend amount
    false, //reverse bend
    1000, //random frequency range
    25, //dissonance
    [0.2, 0.2, 2000], //echo array: [delay, feedback, filter]
    [2, 1, false] //reverb array: [duration, decay, reverse?]
  );
}

//The shoot sound modified
function note() {
  soundEffect(
    261.63, //frequency
    0.5, //attack
    1, //decay
    "sine", //waveform
    1, //Volume
    0, //pan
    0, //wait before playing
    25, //frequency bend amount
    true, //reverse bend
    150, //random frequency range
    0, //dissonance
    [0.2, 0.2, 2000], //echo array: [delay, feedback, filter]
    [2, 1, false] //reverb array: [duration, decay, reverse?]
  );
}

function cgfeRiff() {
  let t = 0,
    i = 0.25,
    type = ["sine", "triangle", "square", "sawtooth"],
    bend = 10,
    rev = false,
    rand = 0,
    diss = 0,
    echo = [0.125, 0.75, 2000], //echo array: [delay, feedback, filter]
    reverb = undefined; // [1, 1, false]; //reverb array: [duration, decay, reverse?]

  let j = 0;
  for (let n = 0; n <= 8; n++) {
    if (j === type.length) j = 0;
    console.log(j);
    soundEffect(
      261.63,
      0,
      1,
      type[j],
      1,
      0,
      t,
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
      //   console.log(type)
    ); //C1
    soundEffect(
      392,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //G1
    soundEffect(
      261.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //C1
    soundEffect(
      349.23,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //F1
    soundEffect(
      261.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //C1
    soundEffect(
      329.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); // E1
    soundEffect(
      261.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); // C1
    soundEffect(
      349.23,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //F1
    soundEffect(
      261.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); // C1
    soundEffect(
      392,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //G1
    soundEffect(
      261.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //C1
    soundEffect(
      349.23,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); //F1
    soundEffect(
      261.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); // C1
    soundEffect(
      329.63,
      0,
      1,
      type[j],
      1,
      0,
      (t += i),
      bend,
      rev,
      rand,
      diss,
      echo,
      reverb
    ); // E1}
    t += i * 3;
    j++;
  }
  t = 0;
}

// Kick Drum from scratch
// Oscillator frequency set at 150Hz
// A useful variable!
let now = actx.currentTime;

// Create the nodes
// let kickOsc = actx.createOscillator();
// let kickGain = actx.createGain();
// Set the oscillator frequency
// kickOsc.frequency.value = 150;

// connect the nodes
// kickOsc.connect(kickGain);
// kickGain.connect(actx.destination);

// set the start volume
// kickGain.gain.setValueAtTime(1, now);

// Ramp the volume down over 1/2 sec
// Note: We don't have this ramp in the sound function
// kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

// Now we can rapidly drop the oscillator frequency
// kickOsc.frequency.setValueAtTime(150, now);
// kickOsc.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);

// Start and stop the oscillator
// kickOsc.start(now);
// kickOsc.stop(now + 0.5);

// Now! Because we can't restart an oscilator once it has been stopped
// we need to wrap the code in a simple object
class Kick {
  constructor(actx) {
    this.actx = actx;
  }
  setup() {
    this.osc = this.actx.createOscillator();
    this.gain = this.actx.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.actx.destination);
  }
  play(time) {
    this.setup();

    this.osc.frequency.setValueAtTime(150, time);
    this.gain.gain.setValueAtTime(1, time);

    this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    console.log("Playing");

    this.osc.start(time);

    this.osc.stop(time + 0.5);
    console.log("Stopped");
  }
}

// Now we can program repeated playing of the kick drum:
let kick = new Kick(actx);
kick.play(actx.currentTime);
kick.play(actx.currentTime + 0.5);
kick.play(actx.currentTime + 1);
kick.play(now + 1.5);
kick.play(now + 2);
kick.play(now + 2.5);

function music() {
  cgfeRiff();
}
import { impulseResponse } from "../lib/sound.js";
import { keyboard } from "../lib/interactive.js";

// set up the keys to play the effects
let one = keyboard(49),
  two = keyboard(50),
  three = keyboard(51),
  four = keyboard(52),
  five = keyboard(53),
  six = keyboard(54),
  seven = keyboard(55),
  eight = keyboard(56),
  nine = keyboard(57);

// define the key's press method
one.press = () => explosionSound();
two.press = () => jumpSound();
three.press = () => shootSound();
four.press = () => grittyAlarm();
five.press = () => softAlarm();
six.press = () => shootSoundMod();
seven.press = () => note();
eight.press = () => music();
nine.press = () => {
  let kick = new Kick(actx);
  kick.play(now);
  kick.play(now + 0.5);
  kick.play(now + 1);
  kick.play(now + 1.5);
  kick.play(now + 2);
};
