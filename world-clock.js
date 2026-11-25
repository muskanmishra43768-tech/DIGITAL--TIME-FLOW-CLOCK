const countries = [
    { name: "India", flag: "🇮🇳", timezone: "Asia/Kolkata" },
    { name: "USA", flag: "🇺🇸", timezone: "America/New_York" },
    { name: "United Kingdom", flag: "🇬🇧", timezone: "Europe/London" },
    { name: "Dubai", flag: "🇦🇪", timezone: "Asia/Dubai" },
    { name: "Japan", flag: "🇯🇵", timezone: "Asia/Tokyo" },
    { name: "Australia", flag: "🇦🇺", timezone: "Australia/Sydney" }
];

function createWorldClocks() {

    const container = document.getElementById("worldClocks");

    if (!container) {
        console.error("World Clock container missing!");
        return;
    }

    container.innerHTML = "";

    countries.forEach((country, index) => {

        const card = document.createElement("div");

        card.className = "world-card";

        card.innerHTML = `
            <h3>${country.flag} ${country.name}</h3>
            <div class="world-time" id="worldTime${index}">00:00:00</div>
            <div class="world-date" id="worldDate${index}">Loading...</div>
        `;

        container.appendChild(card);

    });

    updateWorldClock();
}

function updateWorldClock() {

    const now = new Date();

    countries.forEach((country, index) => {

        const time = new Intl.DateTimeFormat("en-US", {
            timeZone: country.timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }).format(now);

        const date = new Intl.DateTimeFormat("en-US", {
            timeZone: country.timezone,
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);

        document.getElementById("worldTime" + index).textContent = time;

        document.getElementById("worldDate" + index).textContent = date;

    });
}

createWorldClocks();

setInterval(updateWorldClock, 1000);
