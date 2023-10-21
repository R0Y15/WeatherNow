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
    // Hide the result initially
    result.style.display = "none";
    loader.style.display = "block";

    // Check if the input is not empty
    if (input) {
        // Create a URL for the weather API with the input as a query parameter
        const token = OPENWEATHERMAP_TOKEN;
        var url =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            input +
            "&units=metric&appid=" +
            token;

        // Fetch the data from the URL using the fetch API
        fetch(url)
            .then(function (response) {
                // Check if the response is ok
                if (response.ok) {
                    // Convert the response to JSON format
                    return response.json();
                } else {
                    // Throw an error if the response is not ok
                    throw new Error("Something went wrong");
                }
            })
            .then(function (data) {
                // Extract the relevant data from the JSON object
                var city = data.name; // The city name
                var country = data.sys.country; // The country code
                var temp = data.main.temp; // The current temperature in Celsius
                var feels_like = data.main.feels_like; // The feels like temperature in Celsius
                var humidity = data.main.humidity; // The humidity percentage
                var wind = data.wind.speed; // The wind speed in meters per second
                var description = data.weather[0].description; // The weather description

                // Create a HTML string to display the data in a formatted way

                let html =
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
                    "<p><span class='label'>Humidity:</span> <span class='value'>" +
                    humidity +
                    " % <i class='fas fa-tint fa-lg'></i></span></p>";
                html +=
                    "<p><span class='label'>Wind:</span> <span class='value'>" +
                    wind +
                    " m/s <i class='fas fa-wind fa-lg'></i></span></p>";

                // Set the inner HTML of the result div to the HTML string
                result.innerHTML = html;

                // Show the result div
                loader.style.display = "none";
                result_container.style.display = "block";
                result.style.display = "block";
            })
            .catch(function (error) {
                // Handle any errors that may occur
                result_container.style.display = "none";
                alert(error.message);
            });
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
};

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

// Initial chart setup (you can set initial data or leave it empty)
const ctx = document.getElementById('hourlyChart').getContext('2d');
const hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Hour'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperature (°C)'
                }
            }
        }
    },
});


// Update Graph Type
function selectedDropdown(event){
    document.querySelector('.dropbtn').textContent = event.target.textContent;
    document.querySelector('.dropbtn').name = event.target.name;
    switch (event.target.name) {
        case 'bar':
            hourlyChart.options={
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
            };
            break;
        case 'doughnut':
            hourlyChart.options={};
            break;
        case 'polarArea':
            hourlyChart.options={};
            break;
        case 'radar':
            hourlyChart.options={
                elements: {
                  line: {
                    borderWidth: 3
                  }
                }
              };
            break;
        default:
            hourlyChart.options={
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hour'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            };
            break;
    }
    hourlyChart.config.type= event.target.name;
    hourlyChart.update('none');
    // Graph Type Updated
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

window.addEventListener("load", function() {
    const currentYear = new Date().getFullYear();
    document.getElementById("copyrightYear").textContent = currentYear;
});