function createAnimationDIV(name) {
    var newDiv = document.createElement("div");
    newDiv.classList.add("anim");
    var currentDiv = document.getElementById("div1");
    document.body.insertBefore(newDiv, currentDiv);
    var direction = 1;
    newDiv.style.setProperty("transform", "scale(3)");
    var logo = bodymovin.loadAnimation({
        container: newDiv,
        // Required
        path: 'animation/' + name,
        // Required
        renderer: 'svg',
        // Required
        loop: true,
        // Optional
        autoplay: true,
        // Optional
        name: "Hello World",
        // Name for future reference. Optional.
    });
    logo.setSpeed(.5);
    //logo.onComplete = function() {
    //logo.destroy();
    //newDiv.remove();

    //}

}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
;//var animList = ['201.json', '202.json', '203.json', '204.json', '205.json', '206.json', '207.json', '208.json', '209.json', '210.json', '211.json'];
//var animList = ["210.json", "206.json", "202.json", "203.json", "208.json", "211.json", "204.json", "209.json", "201.json", "207.json", "205.json"];
//var animListB = shuffle(animList);

var animList = ["202.json", "207.json", "210.json", "206.json", "208.json", "204.json", "211.json", "203.json", "201.json", "205.json", "209.json"];
var animListB = ["201.json", "204.json", "207.json", "205.json", "209.json", "211.json", "203.json", "210.json", "206.json", "202.json", "208.json"];
var animListC = ["205.json", "203.json", "202.json", "201.json", "210.json", "211.json", "206.json", "209.json", "207.json", "204.json", "208.json"];
var animListD = ["208.json", "204.json", "210.json", "207.json", "209.json", "201.json", "211.json", "203.json", "206.json", "202.json", "205.json"];
var animListGRP = [animList, animListB, animListC, animListD];

//animList = shuffle(animList);
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioContext();
var oscillatorNode = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
var analyser = audioCtx.createAnalyser();
var finish = audioCtx.destination;
var micIn;

var audioElement;
var track;

//oscillatorNode.connect(gainNode);
//micIn.connect(gainNode);
gainNode.connect(analyser);
analyser.connect(finish);

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
const sampleBuffer = new Float32Array(analyser.fftSize);
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);
//var previousMax = 0;
var currentMax;
var currentMaxAnim;

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
/*
//var microphone;
if (navigator.getUserMedia) {
    navigator.getUserMedia({
        audio: true
    }, function(stream) {
        //aCtx = new webkitAudioContext();
        //analyser = aCtx.createAnalyser();
        micIn = audioCtx.createMediaStreamSource(stream);
        micIn.connect(gainNode);
        //analyser.connect(aCtx.destination);
    }, function(err) {
        console.log("The following error occurred: " + err.name);
    });
}

*/
var body;
var animDiv;
var animADiv;
var animBDiv;
var animCDiv;
var animDDiv;

window.onload = function() {

    body = document.getElementsByTagName("BODY")[0];
    animDiv = document.getElementById("animDiv");

    draw();

    // Setup all nodes

    audioElement = document.querySelector('audio');
    track = audioCtx.createMediaElementSource(audioElement);
    track.connect(gainNode);
    const playButton = document.getElementById("playButton");
    animADiv = document.getElementById("aaa");
    animBDiv = document.getElementById("bbb");
    animCDiv = document.getElementById("ccc");
    animDDiv = document.getElementById("ddd");

    playButton.addEventListener('click', function() {

        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // play or pause track depending on state
        if (this.dataset.playing === 'false') {
            audioElement.play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            this.dataset.playing = 'false';
        }
        createAnimation(animADiv, 0);
        createAnimation(animBDiv, 1);
        createAnimation(animCDiv, 2);
        createAnimation(animDDiv, 3);

    }, false);
}
;

var sheet = document.styleSheets[0];
var rules = sheet.cssRules || sheet.rules;

//rules[0].style.fill = 'linear-gradient(45deg, red, blue)';
var peakInstantaneousPower;
var peakInstantaneousPowerDecibels;
var avgPowerDecibels;
function draw() {

    analyser.getByteFrequencyData(dataArray);
    //decible calculator
    analyser.getFloatTimeDomainData(sampleBuffer);
    let sumOfSquares = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
        sumOfSquares += sampleBuffer[i] ** 2;
    }
    avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

    // Compute peak instantaneous power over the interval.
    peakInstantaneousPower = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
        const power = sampleBuffer[i] ** 2;
        peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
    }
    peakInstantaneousPowerDecibels = 10 * Math.log10(peakInstantaneousPower);
    //console.log(dataArray);
    //console.log(indexOfMax(dataArray));
    currentMax = indexOfMax(dataArray);
    currentMaxAnim = indexOfMaxAnim(dataArray);
    var scale = dataRange(0, 2, -70, 0, avgPowerDecibels);
    if (scale < .5) {
        scale = 0;
    }
    animDiv.style.setProperty("transform", "scale(" + scale + ")");
    //var gradientScale = dataRange(50, 150, -50, -20, avgPowerDecibels);
    var gradientScale = Math.min(Math.max(dataRange(10, 90, -50, -20, avgPowerDecibels), 10), 90);
    //console.log(gradientScale);
    //var gradientRotateScale = dataRange(0, 180, -80, 0, avgPowerDecibels) % 360;
    var gradientRotateScale = Math.min(Math.max(dataRange(45, 135, -90, 0, avgPowerDecibels), 0), 180);
    //console.log(gradientRotateScale);

    document.getElementById("off2").attributes[1].value = Math.round(gradientScale) + "%";
    document.getElementById("roboGradient").attributes[1].value = "rotate(" + Math.round(gradientRotateScale) + ")";
    var gradientColorScale = dataRange(0, 1000, -80, 0, avgPowerDecibels) % 360
    document.getElementById("off2").attributes[2].value = "hsl(" + gradientColorScale + ", 100%, 50%)"
    //currentDiv.style.setProperty("transform", "scale(" + peakInstantaneousPower * 3 + ")");
    //with rotations
    //currentDiv.style.setProperty("transform", "scale(" + Math.log(dataArray[currentMax] / 100) + ") rotate(" + dataArray[currentMax] / 10 + "deg)");
    //rules[0].style.fill = "hsl(" + currentMax * 100 + "," + dataArray[currentMax] + "%," + dataArray[currentMax] / 10 + "%)";
    //rules[0].style.fill = "hsl(" + currentMax * 100 + "," + dataArray[currentMax] + "%," + dataArray[currentMax] / 10 + "%)";
    //colour background change

    //body.style.setProperty("background-color", "hsl(" + currentMax * 100 + "," + dataArray[currentMax] + "%," + dataArray[currentMax] / 10 + "%)");

    /*if (currentMax != previousMax) {
        //console.log('something has changed');
        //console.log(Math.log(dataArray[currentMax] / 100) * 5);
        previousMax = currentMax;
        //createAnimation(animList[currentMax]);
    }*/

    //console.log(dataArray);
    requestAnimationFrame(draw);

}
var dilDong;
function createAnimation(targetAnimDiv, animListARG) {
    //dilDong = animListARG;
    //var newDiv = document.createElement("div");
    //newDiv.classList.add("anim");
    //document.body.insertBefore(newDiv, currentDiv);
    var direction = 1;
    //newDiv.style.setProperty("transform", "scale(3)");
    var logo = bodymovin.loadAnimation({
        container: targetAnimDiv,
        // Required
        //path: 'animation/' + animList[2],
        path: 'animation/' + animListGRP[animListARG][currentMaxAnim],

        //path: 'animation/' + animList[parseInt(dataRange(0,animList.length-1,0, dataArray.length-1, currentMax))],
        // Required
        renderer: 'svg',
        // Required
        loop: false,
        // Optional
        autoplay: true,
        // Optional
        name: "Hello World",
        // Name for future reference. Optional.
    });
    //logo.setSpeed(dataArray[currentMax] / 75);
    var logoSpeed = Math.min(Math.max(dataRange(.5, 4, -90, 0, avgPowerDecibels), .5), 4);
    //console.log(logoSpeed);
    logo.setSpeed(dataRange(1, 3, -90, 0, avgPowerDecibels));
    logo.onComplete = function() {
        logo.destroy();
        createAnimation(targetAnimDiv, animListARG);
        //console.log(dataRange(0, 3, -70, 0, peakInstantaneousPowerDecibels));
        //newDiv.remove();

    }

}
;function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
;function dataRange(xMax, xMin, yMax, yMin, inputY) {

    const percent = (inputY - yMin) / (yMax - yMin);
    const outputX = percent * (xMax - xMin) + xMin;
    return outputX;
}
;function indexOfMaxAnim(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < animList.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
;// Fix up prefixing
//var context = new AudioContext();
