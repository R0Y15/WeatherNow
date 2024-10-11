import { OPENWEATHERMAP_TOKEN } from './config.js'

window.getCurrLoc = function() {

    // Get the result div element
    var result = document.getElementById("result");
    var loader = document.getElementById("loader");
    var result_container = document.querySelector(".result-container");
    var hourlyChart = document.getElementById("hourlyChart");

    // Hide the result initially
    result.style.display = "none";
    loader.style.display = "block";
    hourlyChart.style.display = "none";
    
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


document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getCurrLoc();
    }
});

window.addEventListener("load", function() {
    const currentYear = new Date().getFullYear();
    document.getElementById("copyrightYear").textContent = currentYear;
});