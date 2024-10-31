import { OPENWEATHERMAP_TOKEN } from './config.js'

window.getCurrLoc = function () {

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

        const token = OPENWEATHERMAP_TOKEN;

        // Construct the OpenWeatherMap API URL
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${token}&units=metric`;


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
                var visibility = data.visibility / 1000; // The visibility in km
                const weatherMain = data.weather[0].main; // The main weather type
                const sunrise = data.sys.sunrise;
                const sunset = data.sys.sunset;
                const timezoneOffset = data.timezone;  // Get timezone offset in seconds

                // Update the background image based on the weather
                updateBackground(weatherMain);

                // Create a HTML string to display the data in a formatted way

                let html = '<div class="card-content">';
                html += '<div class="left-side">';
                html += `<p><span class='value city'>${city}, ${country}</span></p>`;
                html += `<p><span class='value temp'>${temp} °C ${getTemperatureIcon(description)}</span></p>`;
                html += `<p><span class='value description' style='text-transform:capitalize'>${description} ${getWeatherIcon(description)}</span></p>`;
                html += `<p><span class='value feels_like'>Feels Like: ${feels_like}°C</span></p>`;
                html += '</div>';
                html += '<div class="separator"></div>';
                html += '<div class="right-side">';
                html += `<p><span class='value sunrise'>Sunrise: ${convertToLocalTime(sunrise, timezoneOffset)} <i class='fas fa-sun'></i></span></p>`;
                html += `<p><span class='value sunset'>Sunset: ${convertToLocalTime(sunset, timezoneOffset)} <i class='fas fa-moon'></i></span></p>`;
                html += `<p><span class='value humidity'>Humidity: ${humidity}% <i class='fas fa-tint'></i></span></p>`;
                html += `<p><span class='value wind'>Wind: ${wind} m/s <i class='fas fa-wind'></i></span></p>`;
                html += `<p><span class='value visibility'>Visibility: ${visibility} km <i class='fas fa-eye'></i></span></p>`;
                html += '</div>';
                html += '</div>';


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
        switch (error.code) {
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


// To know more weather data
function showContent(humidity, wind, visibility, sunrise, sunset, timezoneOffset) {
    // Get the result div element
    var result = document.getElementById("result");
    var loader = document.getElementById("loader");
    var result_container = document.querySelector(".result-container");

    let html =
        "<p><span class='value sunrise'>" +
        "Sunrise: " + convertToLocalTime(sunrise, timezoneOffset) +
        " <i class='fas fa-sun'></i> </span></p>";

    html +=
        "<p><span class='value sunset'>" +
        "Sunset: " + convertToLocalTime(sunset, timezoneOffset) +
        " <i class='fas fa-moon'></i> </span></p>";

    html +=
        "<p><span class='value humidityl'>Humidity:</span> <span class='value'>" +
        humidity +
        " % <i class='fas fa-tint fa-lg'></i></span></p>";

    html +=
        "<p><span class='value wind'>Wind:</span> <span class='value'>" +
        wind +
        " m/s <i class='fas fa-wind fa-lg'></i></span></p>";

    html +=
        "<p><span class='value visibility'>" +
        "Visibility: " + visibility + " km <i class='fas fa-eye fa-lg'></i></span></p>";

    // Set the inner HTML of the result div to the HTML string
    result.innerHTML = html;

    // Show the result div
    loader.style.display = "none";
    result_container.style.display = "block";
    result.style.display = "block";
}



// Convert UNIX timestamp to local time in AM/PM format
function convertToLocalTime(unixTimestamp, timezoneOffset) {
    const localTime = new Date((unixTimestamp + timezoneOffset) * 1000);  // Convert to milliseconds
    let hours = localTime.getUTCHours();
    const minutes = localTime.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;  // Convert hour '0' to '12'
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesFormatted} ${ampm}`;
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


// Function to update the line graph with new data
function updateChart(data) {
    // Extract relevant data from the API response (adjust according to your API)
    const hourlyTemperature = data?.list?.map(item => item.main.temp);
    const hourlyTime = data?.list?.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Update the chart data
    if (hourlyTime && hourlyTemperature) {
        hourlyChart.data.labels = hourlyTime;
        hourlyChart.data.datasets[0].data = hourlyTemperature;
        hourlyChart.update();
    } else {
        console.log("Data for chart update is missing or invalid.");
    }
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

    // write code to retrieve name of city to cityinput
    const response = await fetch(url);
    const data = await response.json();
    var cityInput = data.name;

    if (cityInput) {
        const weatherData = await fetchWeatherData();
        if (weatherData) {
            // updateChart(weatherData);
            const forecast_url = await getForecastApiUrl();
            fetch(forecast_url)
                .then(response => response.json())
                .then(data => {
                    // Call updateChart after the data is fetched
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

// Function to update the background image based on the weather
function updateBackground(weatherMain) {
    const weatherImages = {
        Clear: "https://images.pexels.com/photos/96622/pexels-photo-96622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Clouds: "https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Rain: "https://images.pexels.com/photos/325676/pexels-photo-325676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Drizzle: "https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Thunderstorm: "https://images.pexels.com/photos/1118869/pexels-photo-1118869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Snow: "https://images.pexels.com/photos/1571442/pexels-photo-1571442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Mist: "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Smoke: "https://images.pexels.com/photos/414659/pexels-photo-414659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Haze: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Dust: "https://images.pexels.com/photos/20045/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Fog: "https://images.pexels.com/photos/978844/pexels-photo-978844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    };
  
    // Set the background image according to the weather main type
    const backgroundImage = weatherImages[weatherMain] || "https://wallpapers.com/images/hd/weather-scenarios-collage-dbk9c5n23l7e5fgb.jpg";
    document.body.style.backgroundImage = `url('${backgroundImage}')`;
  }

document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', selectedDropdown);
});


document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getCurrLoc();
    }
});


window.addEventListener("load", function () {
    const currentYear = new Date().getFullYear();
    document.getElementById("copyrightYear").textContent = currentYear;
});