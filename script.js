const weatherForm = document.getElementById("weather-form")
const submitBtn = document.getElementById("submit-btn");
const userInput = document.getElementById("user-input");
const outputDiv = document.querySelector(".output-div");
const output = document.getElementById("output-placeholder");

// my api key for openweathermap api
const apiKey = "";

weatherForm.addEventListener("submit", (event) => {
    document.querySelector(".weather-grid").classList.add("invisible");
    event.preventDefault();
    output.innerHTML =`Searching for weather in ${userInput.value}...`;
    outputDiv.classList.remove("invisible");
    getWeather();
    userInput.value = "";
});


async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${userInput.value}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            output.innerHTML = `<span style="color: #6d100dff;">Failed to find a matching station. Please enter a valid city.<span>`;
            throw new Error(`Response status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(result);

        const weatherResult = {
            city: result.name + " ," + result.sys.country,
            temp: result.main.temp + " °C",
            humidity: result.main.humidity + "%",
            weather: result.weather[0].main,
            desc: result.weather[0].description,
            icon: result.weather[0].icon
        };
        console.log(weatherResult);

        const iconUrl = `https://openweathermap.org/img/wn/${weatherResult.icon}@2x.png`;

        output.innerHTML = `<span>Weather for <span style="color: #5590b9;">${weatherResult.city}</span>:<span>`;
        const weatherDivs = document.querySelectorAll(".weather-grid div");
        let count = 0;

        weatherDivs.forEach(weatherDiv => {
            switch(count) {
                case 0:
                    weatherDiv.innerHTML = `
                        <img src="${iconUrl}" alt="${weatherResult.desc}" style="width:60px; height:60px;">
                        <h3>${weatherResult.weather}</h3>
                        <span>${weatherResult.desc}</span>
                    `;
                    break;
                case 1:
                    weatherDiv.innerHTML = `
                        <p>Temperature</p><span><i class="bi bi-thermometer"></i></span><span>${weatherResult.temp}</span>
                    `;
                    break;
                case 2:
                    weatherDiv.innerHTML = `
                        <p>Humidity</p><span><i class="bi bi-moisture"></i></span><span>${weatherResult.humidity}</span>
                    `;
            }
            count += 1;
        });
        document.querySelector(".weather-grid").classList.remove("invisible");

    } catch (error) {
        console.error(error.message);
    }
}