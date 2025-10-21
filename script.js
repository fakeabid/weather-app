const weatherForm = document.getElementById("weather-form")
const submitBtn = document.getElementById("submit-btn");
const userInput = document.getElementById("user-input");
const outputDiv = document.querySelector(".output-div");
const output = document.getElementById("output-placeholder");

const weatherGrid = document.querySelector(".weather-grid");

// my api key for openweathermap api
const apiKey = "";

weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    output.innerHTML =`Searching for weather in ${userInput.value}...`;

    outputDiv.classList.remove("invisible");
    // delay to trigger animation
    setTimeout(() => {
        outputDiv.classList.add("show");
    }, 300);
    
    getWeather();
    userInput.value = "";
});


async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${userInput.value}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            weatherGrid.classList.remove("show"); // makes the weather cards dissapear
            setTimeout(() => {
                weatherGrid.classList.add("invisible"); // removes them from document flow after the animation
            }, 300);
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

        // hide first to reset animation
        weatherGrid.classList.remove("show");
        weatherGrid.classList.remove("invisible");

        // delay to trigger animation
        setTimeout(() => {
            weatherGrid.classList.add("show");
        }, 300);

    } catch (error) {
        console.error(error.message);
    }
}