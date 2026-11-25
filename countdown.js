let remainingSeconds = 0;
let endTime = 0;
let countdownInterval = null;

const display = document.getElementById("countdownDisplay");
const message = document.getElementById("timerMessage");

function updateDisplay() {
    let h = Math.floor(remainingSeconds / 3600);
    let m = Math.floor((remainingSeconds % 3600) / 60);
    let s = remainingSeconds % 60;

    display.textContent =
        String(h).padStart(2, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0");
}

function getInputTime() {
    let h = Number(document.getElementById("hours").value);
    let m = Number(document.getElementById("minutes").value);
    let s = Number(document.getElementById("seconds").value);

    if (h < 0 || m < 0 || m > 59 || s < 0 || s > 59) {
        message.textContent = "Enter valid time!";
        return null;
    }

    return h * 3600 + m * 60 + s;
}

// START
document.getElementById("startTimer").onclick = function() {

    if (countdownInterval !== null) return;

    if (remainingSeconds === 0) {
        remainingSeconds = getInputTime();

        if (remainingSeconds === null || remainingSeconds <= 0) {
            remainingSeconds = 0;
            message.textContent = "Please set a valid time!";
            return;
        }
    }

    endTime = Date.now() + remainingSeconds * 1000;

    message.textContent = "Timer Running...";

    countdownInterval = setInterval(function() {
        remainingSeconds = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
        );

        updateDisplay();

        if (remainingSeconds === 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            message.textContent = "Time's Up!";
            playAlarm();
        }
    }, 200);
};

// PAUSE
document.getElementById("pauseTimer").onclick = function() {

    if (countdownInterval !== null) {
        clearInterval(countdownInterval);
        countdownInterval = null;

        remainingSeconds = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
        );

        updateDisplay();
        message.textContent = "Timer Paused!";
    }
};

// RESET
document.getElementById("resetTimer").onclick = function() {
    clearInterval(countdownInterval);
    countdownInterval = null;

    remainingSeconds = 0;
    endTime = 0;

    document.getElementById("hours").value = 0;
    document.getElementById("minutes").value = 0;
    document.getElementById("seconds").value = 0;

    updateDisplay();
    message.textContent = "Timer Reset!";
};

// ALARM
function playAlarm() {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;

    const audio = new AudioClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.frequency.value = 800;
    gain.gain.value = 0.2;

    oscillator.start();
    oscillator.stop(audio.currentTime + 1);
}

updateDisplay();
