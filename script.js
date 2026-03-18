
const form = document.querySelector("form");
const cityInput = document.getElementById("cityInput");
const fetchData = document.getElementById("fetchData");
const searchedCities = document.querySelector(".searchedCities");

// Get history
function getHistory() {
    return JSON.parse(localStorage.getItem("cities")) || [];
}

// Save history
function saveHistory(cityName) {
    let history = getHistory();

    history = history.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    history.unshift(cityName);

    if (history.length > 5) history = history.slice(0, 5);

    localStorage.setItem("cities", JSON.stringify(history));
    renderHistory();
}

// Render history
function renderHistory() {
    let history = getHistory();
    searchedCities.innerHTML = "";

    if (history.length === 0) {
        searchedCities.innerHTML = "<p>No recent searches</p>";
        return;
    }

    history.forEach(city => {
        let btn = document.createElement("button");
        btn.textContent = city;

        btn.addEventListener("click", () => {
            getWeather(city);
        });

        searchedCities.appendChild(btn);
    });
}

// Fetch weather
async function getWeather(city) {
    try {
        fetchData.innerHTML = "Loading...";

        const apiKey = "0f957dc1df8afe17f385f698d92021ac";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
            fetchData.innerHTML = "City not found ❌";
            return;
        }

        fetchData.innerHTML = `
            <div class="weather-row">
                <span class="label">City</span>
                <span class="value">${data.name}, ${data.sys.country}</span>
            </div>
            <div class="weather-row">
                <span class="label">Temp</span>
                <span class="value">${data.main.temp} °C</span>
            </div>
            <div class="weather-row">
                <span class="label">Weather</span>
                <span class="value">${data.weather[0].main}</span>
            </div>
            <div class="weather-row">
                <span class="label">Humidity</span>
                <span class="value">${data.main.humidity}%</span>
            </div>
            <div class="weather-row">
                <span class="label">Wind</span>
                <span class="value">${data.wind.speed} m/s</span>
            </div>
        `;

        saveHistory(city);

    } catch (err) {
        fetchData.innerHTML = "Error fetching data ⚠️";
    }
}

// Form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
        cityInput.value = "";
    }
});

// Load history on start
renderHistory();
