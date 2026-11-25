let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let lapCount = 0;

const display = document.getElementById("stopwatchDisplay");
const lapList = document.getElementById("lapList");

function updateDisplay() {

    let time = elapsedTime;

    let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time % 3600000) / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);

    display.textContent =
        String(hours).padStart(2, '0') + ":" +
        String(minutes).padStart(2, '0') + ":" +
        String(seconds).padStart(2, '0') + "." +
        String(milliseconds).padStart(2, '0');
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
}

// START
document.getElementById("startBtn").addEventListener("click", function() {

    if (timerInterval !== null) return;

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(updateTimer, 10);

});

// PAUSE
document.getElementById("pauseBtn").addEventListener("click", function() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);
        timerInterval = null;

        updateTimer();
    }

});

// RESET
document.getElementById("resetBtn").addEventListener("click", function() {

    clearInterval(timerInterval);

    timerInterval = null;
    elapsedTime = 0;
    lapCount = 0;

    lapList.innerHTML = "";

    updateDisplay();

});

// LAP
document.getElementById("lapBtn").addEventListener("click", function() {

    if (timerInterval === null) {
        alert("Please start the stopwatch first!");
        return;
    }

    updateTimer();

    lapCount++;

    let li = document.createElement("li");

    let lapName = document.createElement("span");
    lapName.textContent = "Lap " + lapCount;

    let lapTime = document.createElement("span");
    lapTime.textContent = display.textContent;

    li.appendChild(lapName);
    li.appendChild(lapTime);

    lapList.prepend(li);

});

updateDisplay();
