function updateClock() {

    let now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    document.getElementById("time").innerHTML =
        `${hours}:${minutes}:${seconds}`;

    document.getElementById("ampm").innerHTML = ampm;

    document.getElementById("day").innerHTML =
        now.toLocaleDateString('en-US', { weekday: 'long' });

    document.getElementById("date").innerHTML =
        now.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

    let hour = now.getHours();
    let greeting = "Good Evening 🌙";

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning ☀️";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon 🌸";
    }

    document.getElementById("greeting").innerHTML = greeting;
}

updateClock();

setInterval(updateClock, 1000);
