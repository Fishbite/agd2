// The most basic code required to create an oscillator
let actx = new AudioContext();

// create a new oscillator
let oscillator = actx.createOscillator();

// This will play at 440Hz middle-A
oscillator.frequency.value = 440;

oscillator.connect(actx.destination);

oscillator.start();
oscillator.stop();

// Add an oscillator type
let oscillator2 = actx.createOscillator();
oscillator2.type = "sine";
// play a middle C
oscillator2.frequency.value = 261.63;

oscillator2.connect(actx.destination);
oscillator2.start();
oscillator2.stop();
