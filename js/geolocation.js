import { OPENWEATHERMAP_TOKEN } from './config.js'

window.getCurrLoc = function() {

    // Get the result div element
    var result = document.getElementById("result");
    var loader = document.getElementById("loader");
    var result_container = document.querySelector(".result-container");
    // var hourlyChart = document.getElementById("hourlyChart");
    

    // Hide the result initially
    result.style.display = "none";
    loader.style.display = "block";
    
    // hourlyChart.style.display = "none";
    
    if (navigator.geolocation) {
        console.log("Geolocation is supported. Getting location...");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('weather-info').innerHTML = "Geolocation is not supported by this browser.";
        console.error("Geolocation is not supported by this browser.");
    }

    

    function showPosition(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`User's location: Latitude: ${lat}, Longitude: ${lon}`);

        const token = OPENWEATHERMAP_TOKEN;

        // Construct the OpenWeatherMap API URL
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${token}&units=metric`;

    
        console.log(`Fetching weather data from: ${url}`);

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
    }

    function showError(error) {
        let errorMessage = "";
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                errorMessage = "An unknown error occurred.";
                break;
        }
        document.getElementById('weather-info').innerHTML = errorMessage;
        console.error("Geolocation error: ", errorMessage);
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



async function getWeatherApiUrl() {
    try {
        // Await the geolocation position
        const position = await getCurrentPositionPromise();

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const token = OPENWEATHERMAP_TOKEN;

        // Construct the API URL
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${token}&units=metric`;

        return apiUrl;  // Return the constructed URL
    } catch (error) {
        console.error('Error retrieving geolocation:', error);
        return null;  // Return null if there's an error
    }
}

async function getForecastApiUrl() {
    try {
        // Await the geolocation position
        const position = await getCurrentPositionPromise();

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const token = OPENWEATHERMAP_TOKEN;

        // Construct the API URL
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${token}&units=metric`;

        return apiUrl;  // Return the constructed URL
    } catch (error) {
        console.error('Error retrieving geolocation:', error);
        return null;  // Return null if there's an error
    }
}

// Geolocation Promise
function getCurrentPositionPromise() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
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


// Function to update the line graph with new data for daily forecast
function updateChart(data) {
    // Group the data by date
    const dailyData = data.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString(); // Get the date from the timestamp
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item.main.temp); // Collect temperatures for each day
        return acc;
    }, {});

    // Compute the average temperature for each day
    const dailyTemperature = Object.keys(dailyData).map(date => {
        const temps = dailyData[date];
        const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
        return { date, avgTemp };
    });

    // Update chart labels and data
    const labels = dailyTemperature.map(item => item.date);
    const temperatures = dailyTemperature.map(item => item.avgTemp);

    // Update the chart
    hourlyChart.data.labels = labels;
    hourlyChart.data.datasets[0].data = temperatures;
    hourlyChart.data.datasets[0].label = "Daily Average Temperatures";
    hourlyChart.update();
}



// Function to fetch data for the weather graph for a given city
async function fetchWeatherData() {
    try {
        const url = await getForecastApiUrl();
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function for displaying graph for weather
async function getGraph() {
    const url = await getWeatherApiUrl();

    const response = await fetch(url);
    const data = await response.json();
    const cityInput = data.name;

    if (cityInput) {
        const weatherData = await fetchWeatherData();
        if (weatherData) {
            const forecast_url = await getForecastApiUrl();
            fetch(forecast_url)
            .then(response => response.json())
            .then(data => {
                // Call updateChart with grouped daily data
                updateChart(data);
            })
            .catch(error => console.error('Error fetching data:', error));
        }
    } else {
        alert('Current City is not accessible.');
    }
}






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
        getCurrLoc();
    }
});


window.addEventListener("load", function() {
    const currentYear = new Date().getFullYear();
    document.getElementById("copyrightYear").textContent = currentYear;
});