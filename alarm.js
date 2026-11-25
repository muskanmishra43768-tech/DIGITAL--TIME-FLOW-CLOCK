let alarms = [];
let alarmInterval = null;
let ringingAlarm = false;
let audioContext = null;
let alarmSoundInterval = null;

const hoursInput = document.getElementById("alarmHours");
const minutesInput = document.getElementById("alarmMinutes");
const periodInput = document.getElementById("alarmPeriod");

const alarmDisplay = document.getElementById("alarmDisplay");
const alarmMessage = document.getElementById("alarmMessage");
const alarmList = document.getElementById("alarmList");

const setAlarmButton = document.getElementById("setAlarm");
const stopAlarmButton = document.getElementById("stopAlarm");


// Update selected time
function updateAlarmDisplay() {
    let hours = Number(hoursInput.value);
    let minutes = Number(minutesInput.value);
    let period = periodInput.value;

    alarmDisplay.textContent =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + " " + period;
}

hoursInput.addEventListener("input", updateAlarmDisplay);
minutesInput.addEventListener("input", updateAlarmDisplay);
periodInput.addEventListener("change", updateAlarmDisplay);


// Load alarms from database
async function loadAlarms() {
    try {
        const response = await fetch("/api/alarms");
        if (!response.ok) throw new Error("Unable to load alarms");

        const data = await response.json();

        alarms = data.map(item => ({
            id: item.id,
            label: item.label,
            time: new Date(item.target_time),
            triggered: Boolean(item.triggered)
        }));

        showAlarms();

    } catch (error) {
        alarmMessage.textContent = "Could not load saved alarms.";
        console.error(error);
    }
}


// Set Alarm and save in database
setAlarmButton.addEventListener("click", async function () {

    let hours = Number(hoursInput.value);
    let minutes = Number(minutesInput.value);
    let period = periodInput.value;

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 1 || hours > 12 ||
        minutes < 0 || minutes > 59
    ) {
        alarmMessage.textContent = "Please enter a valid time!";
        return;
    }

    let alarmHours = hours % 12;

    if (period === "PM") {
        alarmHours += 12;
    }

    let targetTime = new Date();
    targetTime.setHours(alarmHours, minutes, 0, 0);

    if (targetTime <= new Date()) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const label =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + " " + period;

    try {
        const response = await fetch("/api/alarms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                label: label,
                target_time: targetTime.toISOString()
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Alarm could not be saved");
        }

        alarmMessage.textContent = "Alarm saved successfully! ❤️";

        await loadAlarms();

    } catch (error) {
        alarmMessage.textContent = error.message;
        console.error(error);
    }
});


// Display Active Alarms
function showAlarms() {

    alarmList.innerHTML = "";

    if (alarms.length === 0) {
        alarmList.innerHTML = "<p>No alarms added yet.</p>";
        return;
    }

    alarms.forEach(function (alarm) {

        let alarmItem = document.createElement("div");
        alarmItem.className = "alarm-item";

        let timeText = document.createElement("span");
        timeText.textContent = alarm.label +
            (alarm.triggered ? " - Completed" : " - Active");

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";

        deleteButton.addEventListener("click", async function () {

            try {
                const response = await fetch(
                    `/api/alarms/${alarm.id}`,
                    { method: "DELETE" }
                );

                if (!response.ok) {
                    throw new Error("Could not delete alarm");
                }

                await loadAlarms();
                alarmMessage.textContent = "Alarm deleted!";

            } catch (error) {
                alarmMessage.textContent = error.message;
            }
        });

        alarmItem.appendChild(timeText);
        alarmItem.appendChild(deleteButton);

        alarmList.appendChild(alarmItem);
    });
}


// Check alarm time
alarmInterval = setInterval(function () {

    let now = new Date();

    alarms.forEach(function (alarm) {

        if (!alarm.triggered && now >= alarm.time) {

            alarm.triggered = true;

            alarmMessage.textContent =
                "⏰ Wake Up! Your Alarm is Ringing!";

            playAlarmSound();
            showAlarms();
        }
    });

}, 500);


// Alarm sound
function playAlarmSound() {

    if (ringingAlarm) return;

    ringingAlarm = true;

    const AudioClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) return;

    audioContext = new AudioClass();

    function beep() {

        if (!ringingAlarm) return;

        let oscillator = audioContext.createOscillator();
        let gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gain.gain.value = 0.2;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    beep();
    alarmSoundInterval = setInterval(beep, 1000);
}


// Stop alarm
stopAlarmButton.addEventListener("click", function () {

    ringingAlarm = false;

    clearInterval(alarmSoundInterval);

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }

    alarmMessage.textContent = "Alarm Stopped! ❤️";
});


// Initial setup
updateAlarmDisplay();
loadAlarms();
