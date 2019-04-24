# Responsive Logo

This project is an animated logo that responds to voice. It is client work for Roborace, a company that develops and races autonomous vehicles they call Robocars. Needless to say Roborace is an interesting client to work for with opportunity to develop exciting new experiences to tell their innovative and groundbreaking stories.

The logo for Roborace is a simple hexagon with simple ovals for eyes. Linear media promotional materials has the logo animate & distort in exciting kinetic fashion. However, this work is somewhat tedious, especially if the animation is to be bespoke for every spot. The creative director was looking for a logo that could respond to audio elements within linear media, and respond with animation that matches the energy and makeup of the sound. As a side benefit, this asset could be repurpose for future interactive elements of the Roborace story.

The following are examples from the Creative Director as to inspiration for the look and feel of the proposed logo. These are traditionally animated using keyframe transitions in After Effects. The first examples are relatively simple, the latter add colour and other elements to the mix.

https://vimeo.com/311027813/63a397db6b
https://vimeo.com/314575479/ca88ab326f

Through this process client had already created a nubmer of vector animations in After Effects. My first inclination was to see if we could leverage the work already done and make it respond to an audio input. The challenges were two fold: finding a way to migrate vector animations from After Effects, and make them respond kinetically to an audio input.

To make the logo as deployable and accessible possible, we determined the first prototype would be created for the web. With this framework, video could still be captured to generate elements for linear media applications. To get the vector animations from After Effects to the web, we utilized the established pipeline of the Bodymovin' AE plugin and Lottie JavaScript animation libraries. Bodymovin was pretty straightforward. Once installed, vector comps were easily transferred to the JSON format that Lottie would integrate into our development. With this in hand, we were able to playback our vector animations in our web platform without too much difficulty.

The next challenge was having the animations respond to an audio input, voice specifically. The goal was to have the animation respond to voice in a predictable manner, something that didn't appear to be totally random. This would yield repeatable visual effects with repeated input. To achieve, this the audio input was translated from the time domain to the frequency domain using an FFT. This FFT analyzes a time window of sound and translates this into frequency data of the sampled window. With this, I divided the frequency spectrum into bins. The number of bins matches the number of animations available, eleven for this iteration. I created a script that identified the frequency bin with the highest energy, using this as an index to select an animation. Animations spawn when the previous animation is finished; the new animation is effectively selected from an array of animation names by the dominant frequency bin at the time of spawning.



```var audioCtx = new AudioContext();
var gainNode = audioCtx.createGain();
var analyser = audioCtx.createAnalyser();
var finish = audioCtx.destination;
var micIn;

var audioElement;
var track;
var animating = false;

gainNode.connect(analyser);

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
const sampleBuffer = new Float32Array(analyser.fftSize);
var dataArray = new Uint8Array(bufferLength);
```
