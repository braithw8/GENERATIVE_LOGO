var animList = ["202.json", "207.json", "210.json", "206.json", "208.json", "204.json", "211.json", "203.json", "201.json", "205.json", "209.json"];
var animListB = ["201.json", "204.json", "207.json", "205.json", "209.json", "211.json", "203.json", "210.json", "206.json", "202.json", "208.json"];
var animListC = ["205.json", "203.json", "202.json", "201.json", "210.json", "211.json", "206.json", "209.json", "207.json", "204.json", "208.json"];
var animListD = ["208.json", "204.json", "210.json", "207.json", "209.json", "201.json", "211.json", "203.json", "206.json", "202.json", "205.json"];
var animListGRP = [animList, animListB, animListC, animListD];

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioContext();
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
var currentMax;
var currentMaxAnim;

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

if (navigator.getUserMedia) {
    navigator.getUserMedia({
        audio: true
    }, function(stream) {
        micIn = audioCtx.createMediaStreamSource(stream);
        micIn.connect(gainNode);
    }, function(err) {
        console.log("The following error occurred: " + err.name);
    });
}

var body;
var animDiv;
var animADiv;
var animBDiv;
var animCDiv;
var animDDiv;
var animClass;
var logoFace;

window.onload = function() {
    console.log("loaded");

    body = document.getElementsByTagName("BODY")[0];
    animDiv = document.getElementById("animDiv");
    animClass = document.getElementsByClassName("anim");
    logoFace = document.getElementById("logoFace");

    audioElement = document.querySelector('audio');
    track = audioCtx.createMediaElementSource(audioElement);
    track.connect(gainNode);
    const playButton = document.getElementById("playButton");
    animADiv = document.getElementById("aaa");
    animBDiv = document.getElementById("bbb");
    animCDiv = document.getElementById("ccc");
    animDDiv = document.getElementById("ddd");

    playButton.addEventListener('click', function() {
        animList = ["202.json", "207.json", "210.json", "206.json", "208.json", "204.json", "211.json", "203.json", "201.json", "205.json", "209.json"];
        animListB = ["201.json", "204.json", "207.json", "205.json", "209.json", "211.json", "203.json", "210.json", "206.json", "202.json", "208.json"];
        animListC = ["205.json", "203.json", "202.json", "201.json", "210.json", "211.json", "206.json", "209.json", "207.json", "204.json", "208.json"];
        animListD = ["208.json", "204.json", "210.json", "207.json", "209.json", "201.json", "211.json", "203.json", "206.json", "202.json", "205.json"];
        for (i = 0; i < animListGRP.length; i++) {
            console.log(animListGRP[i]);
        }
        draw();

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!animating) {
            createAnimation(animADiv, 0);
            createAnimation(animBDiv, 1);
            createAnimation(animCDiv, 2);
            createAnimation(animDDiv, 3);
            animating = true;

        }

    }, false)
}

var logoAnim = [null, null, null, null];
var sheet = document.styleSheets[0];
var rules = sheet.cssRules || sheet.rules;

var peakInstantaneousPower;
var peakInstantaneousPowerDecibels;
var avgPowerDecibels;
var speedEase = 0;
var scaleEase = 0;
var colorEase = 0;

function draw() {

    analyser.getByteFrequencyData(dataArray);
    analyser.getFloatTimeDomainData(sampleBuffer);

    let sumOfSquares = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
        sumOfSquares += sampleBuffer[i] ** 2;
    }
    avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

    var scale = dataRange(0, 2, -70, 0, avgPowerDecibels);
    if (scale < 1) {
        scale = 0;
        logoFace.style.setProperty("display", "block");

    } else {
        logoFace.style.setProperty("display", "none");

    }

    var scaleEasing = .2;
    var targetScale = scale;
    var dScale = targetScale - scaleEase;
    scaleEase += dScale * scaleEasing;
    var scaleProperty = (scaleEase * 70).toString() + "%";
    for (i = 0; i < animClass.length; i++) {
        animClass[i].style.setProperty("height", scaleProperty);
        animClass[i].style.setProperty("width", scaleProperty);

    }

    var gradientScale = Math.min(Math.max(dataRange(10, 90, -50, -20, avgPowerDecibels), 10), 90);
    document.getElementById("off2").attributes[1].value = Math.round(gradientScale) + "%";

    var gradientRotateScale = Math.min(Math.max(dataRange(45, 135, -90, 0, avgPowerDecibels), 0), 180);
    document.getElementById("roboGradient").attributes[1].value = "rotate(" + Math.round(gradientRotateScale) + ")";

    var gradientColorScale = Math.min(Math.max(dataRange(0, 1440, -80, 0, avgPowerDecibels), 0), 1440);
    var colorEasing = .01;
    var ddColor = gradientColorScale - colorEase;
    colorEase += ddColor * colorEasing;
    document.getElementById("off2").attributes[2].value = "hsl(" + colorEase + ", 100%, 50%)";

    var logoSpeed = Math.min(Math.max(dataRange(0, 5, -60, 0, avgPowerDecibels), 0), 5);
    var speedEasing = .1;
    var dSpeed = logoSpeed - speedEase;
    speedEase += dSpeed * speedEasing;

    for (i = 0; i < logoAnim.length; i++) {
        if (logoAnim[i] != null) {
            logoAnim[i].setSpeed(speedEase);
        }

    }

    requestAnimationFrame(draw);

}

function createAnimation(targetAnimDiv, animListARG) {
    currentMaxAnim = indexOfMaxAnim(dataArray);
    var direction = 1;
    logoAnim[animListARG] = bodymovin.loadAnimation({
        container: targetAnimDiv,
        path: 'animation/' + animListGRP[animListARG][currentMaxAnim],
        renderer: 'svg',
        loop: false,
        autoplay: true,
    })

    logoAnim[animListARG].onComplete = function() {
        logoAnim[animListARG].destroy();
        createAnimation(targetAnimDiv, animListARG);

    }

}

function dataRange(xMax, xMin, yMax, yMin, inputY) {

    const percent = (inputY - yMin) / (yMax - yMin);
    const outputX = percent * (xMax - xMin) + xMin;
    return outputX;
}

function indexOfMaxAnim(arr) {
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
