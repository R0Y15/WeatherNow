//Preloader 
// Get the DotLottie player
// const preloader = document.querySelector('.preloader');

// function loader() {
//     setTimeout(function() {
//         preloader.style.opacity = '0';
//         setTimeout(function() {
//             preloader.style.display = 'none';
//         }, 2000); // delay time in milliseconds for the display to be set to none after opacity reaches 0
//     }, 2000); // delay time in milliseconds for the opacity to reach 0
// }

// window.onload = loader;



// JavaScript code for fetching and displaying the weather data

import { OPENWEATHERMAP_TOKEN } from './config.js'

window.getWeather = function() {
    // Get the user input from the text box
    var input = document.getElementById("input").value;

    // Get the result div element
    var result = document.getElementById("result");
    var loader = document.getElementById("loader");
    var result_container = document.querySelector(".result-container");
    var hourlyChart = document.getElementById("hourlyChart");

    // Hide the result initially
    result.style.display = "none";
    loader.style.display = "block";
    hourlyChart.style.display = "block";
    
    let api_value;
    // Check if the input is not empty
    if (input) {
        // Create a URL for the weather API with the input as a query parameter
        const token = OPENWEATHERMAP_TOKEN;
        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=metric&appid=" + token;

        console.log("original url", url);

        let city,country,temp,feels_like,humidity,wind,description,visibility,lat,lon,aqi, aqiUrl, aqi_value;
        // First fetch to get AQI
        fetch(url)
            .then(response => response.json())
            .then(data => {
                city = data.name; // The city name
                country = data.sys.country; // The country code
                temp = data.main.temp; // The current temperature in Celsius
                feels_like = data.main.feels_like; // The feels like temperature in Celsius
                humidity = data.main.humidity; // The humidity percentage
                wind = data.wind.speed; // The wind speed in meters per second
                description = data.weather[0].description; // The weather description
                visibility = data.visibility/1000; // The visibility in km

                lat = data.coord.lat;
                lon = data.coord.lon;

                aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${token}&units=metric`;
            
                // Now, perform the second fetch using some information from the first fetch
                return fetch(aqiUrl);
            })
            .then(response => response.json())
            .then(aqiData => {
                aqi = aqiData.list[0].main.aqi;  // Assign AQI to global variable
                console.log(`Air Quality Index: ${aqi}`);

                switch(aqi) {
                    case 1: 
                        aqi_value = "Good";
                        break;
                    case 2: 
                        aqi_value = "Fair";
                        break;
                    case 3: 
                        aqi_value = "Moderate";
                        break;
                    case 4: 
                        aqi_value = "Poor";
                        break;
                    case 5: 
                        aqi_value = "Very Poor";
                        break;
                    default: aqi_value = "Not able to fetch";
                }
                
                // Create a HTML string to display the data in a formatted way

                let html =
                "<p><span class='value city'>" +
                city + "," + country +
                "</span></p>";
                html +=
                    "<p><span class='value temp'>" +
                    temp +
                    " °C " +
                    getTemperatureIcon(description) +
                    "</span></p>";
                html +=
                    "<p><span class='value description' style='text-transform:capitalize'>" +
                    description +
                    getWeatherIcon(description) +
                    "</span></p>";
                html +=
                    "<p><span class='value city'>" +
                    "Feels Like: " + feels_like + "°C" +
                    "</span></p>"; 
                html +=
                    "<p><span class='label'>Humidity:</span> <span class='value'>" +
                    humidity +
                    " % <i class='fas fa-tint fa-lg'></i></span></p>";
                html +=
                    "<p><span class='label'>Wind:</span> <span class='value'>" +
                    wind +
                    " m/s <i class='fas fa-wind fa-lg'></i></span></p>";
                html +=
                    "<p><span class='value city'>" +
                    "Visibility: " + visibility + " km <i class='fas fa-eye fa-lg'></i></span></p>" +
                    "</span></p>";
                html +=
                    "<p><span class='value aqi'>" +
                    "AQI: " + aqi_value +
                    "</span></p>"; 

                // Set the inner HTML of the result div to the HTML string
                result.innerHTML = html;

                // Show the result div
                loader.style.display = "none";
                result_container.style.display = "block";
                result.style.display = "block";
            })
            .catch(error => console.error('Error fetching data:', error));
               
    } else {
        // Alert the user if the input is empty
        alert("Please enter a city name");
    }
    getGraph();
}

function getWeatherIcon(description) {
    // Define mappings of weather descriptions to Font Awesome icons
    var iconMappings = {
        "clear sky": "<i class='fas fa-sun'></i>",
        "few clouds": "<i class='fas fa-cloud-sun'></i>",
        "scattered clouds": "<i class='fas fa-cloud'></i>",
        "broken clouds": "<i class='fas fa-cloud'></i>",
        "overcast clouds": "<i class='fas fa-cloud'></i>",
        fog: "<i class='fas fa-smog'></i>",
        "light rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "moderate rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "heavy rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        // Add more mappings as needed
    };

    // Check if the description exists in the mappings, and return the corresponding icon
    if (iconMappings.hasOwnProperty(description.toLowerCase())) {
        return iconMappings[description.toLowerCase()];
    }

    // If no matching description is found, return an empty string
    return "";
}

function getTemperatureIcon(description) {
    // Define mappings of weather descriptions to Font Awesome temperature icons
    var iconMappings = {
        "clear sky": "<i class='fas fa-sun'></i>",
        "few clouds": "<i class='fas fa-sun'></i>",
        "scattered clouds": "<i class='fas fa-cloud-sun'></i>",
        "broken clouds": "<i class='fas fa-cloud-sun'></i>",
        "overcast clouds": "<i class='fas fa-cloud'></i>",
        fog: "<i class='fas fa-smog'></i>",
        "light rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "moderate rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "heavy rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        // Add more mappings as needed
    };

    // Check if the description exists in the mappings, and return the corresponding icon
    if (iconMappings.hasOwnProperty(description.toLowerCase())) {
        return iconMappings[description.toLowerCase()];
    }

    // If no matching description is found, return an empty string
    return "";
}

// Function for displaying graph for weather
async function getGraph() {
    var cityInput = document.getElementById("input").value;
    if (cityInput) {
        const weatherData = await fetchWeatherData(cityInput);

        if (weatherData) {
            updateChart(weatherData);
        }
    } else {
        alert('Please enter a city name or zip code.');
    }
}

// Function to fetch data for the weather graph for a given city
async function fetchWeatherData(cityName) {
    try {
        // Replace 'YOUR_API_KEY' with your actual weather API key
        const token = OPENWEATHERMAP_TOKEN;
        var url =
            "https://api.openweathermap.org/data/2.5/forecast?q=" +
            cityName +
            "&units=metric&appid=" +
            token;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to update the line graph with new data
function updateChart(data) {
    // Extract relevant data from the API response (adjust according to your API)
    const hourlyTemperature = data?.list?.map(item => item.main.temp);
    const hourlyTime = data?.list?.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    // Update the chart data
    hourlyChart.data.labels = hourlyTime;
    hourlyChart.data.datasets[0].data = hourlyTemperature;
    hourlyChart.update();
}


// Check if the hourlyChart already exists, and destroy it if it does
if (window.hourlyChart instanceof Chart) {
    window.hourlyChart.destroy();
}

// If you're using Chart.js, make sure hourlyChart is defined correctly in your script
const ctx = document.getElementById('hourlyChart').getContext('2d');
window.hourlyChart = new Chart(ctx, {
    type: 'line', // Default type
    data: {
        labels: [], // Populate with your labels
        datasets: [{
            label: 'Hourly Temperatures',
            data: [], // Populate with your data
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 3,
            fill: false,
        }]
    },
    options: {
        scales: {
            x: { 
                title: { display: true, text: 'Hour' } 
            },
            y: { title: { display: true, text: 'Temperature (°C)' }, beginAtZero: true }
        }
    }
});

// Define the selectedDropdown function
function selectedDropdown(event) {
    event.preventDefault(); // Prevent default link behavior
    const target = event.currentTarget;
    const dropbtn = document.querySelector('.dropbtn');

    dropbtn.textContent = target.textContent;
    dropbtn.name = target.getAttribute('name');

    // Update chart options based on selection
    switch (dropbtn.name) {
        case 'bar':
            // Update options for bar chart
            hourlyChart.options.scales.y.beginAtZero = true;
            //hourlyChart.options.scales.x.borderWidth = 3;
            break;
        case 'doughnut':
            // Update options for doughnut chart
            hourlyChart.options = {};
            break;
        case 'polarArea':
            // Update options for polar area chart
            hourlyChart.options = {};
            break;
        case 'radar':
            // Update options for radar chart
            hourlyChart.options.elements.line.borderWidth = 3;
            break;
        default:
            // Default options
            hourlyChart.options.scales = {
                x: { title: { display: true, text: 'Hour' } },
                y: { title: { display: true, text: 'Temperature (°C)' } }
            };
            break;
    }
    hourlyChart.config.type = dropbtn.name; // Set the chart type
    hourlyChart.update(); // Update the chart
}

document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', selectedDropdown);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

window.addEventListener("load", function() {
    const currentYear = new Date().getFullYear();
    document.getElementById("copyrightYear").textContent = currentYear;
});