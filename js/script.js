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

// Function to fetch and display AQI
async function getAQI(lat, lon) {
  const token = OPENWEATHERMAP_TOKEN;
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${token}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Calculate AQI based on pollutant concentrations
    const aqi = calculateAQI(data.list[0].components);
    
    const aqiInfo = document.getElementById('aqi-info');
    
    let aqiDescription = '';
    let aqiColor = '';

    if (aqi <= 50) {
      aqiDescription = 'Good';
      aqiColor = '#00e400';
    } else if (aqi <= 100) {
      aqiDescription = 'Moderate';
      aqiColor = '#ffff00';
    } else if (aqi <= 150) {
      aqiDescription = 'Unhealthy for Sensitive Groups';
      aqiColor = '#ff7e00';
    } else if (aqi <= 200) {
      aqiDescription = 'Unhealthy';
      aqiColor = '#ff0000';
    } else if (aqi <= 300) {
      aqiDescription = 'Very Unhealthy';
      aqiColor = '#8f3f97';
    } else {
      aqiDescription = 'Hazardous';
      aqiColor = '#7e0023';
    }

    aqiInfo.innerHTML = `
      <p>Air Quality Index: <span style="color: ${aqiColor}; font-weight: bold;">${aqi} - ${aqiDescription}</span></p>
    `;
    aqiInfo.style.display = 'block';
  } catch (error) {
    console.error('Error fetching AQI:', error);
  }
}

// Function to calculate AQI based on pollutant concentrations
function calculateAQI(components) {
  // This is a simplified calculation and may not be 100% accurate
  // For a more accurate calculation, you'd need to implement the full EPA algorithm
  const pm25 = components.pm2_5;
  let aqi;

  if (pm25 <= 12.1) {
    aqi = linearScale(pm25, 0, 12.1, 0, 50);
  } else if (pm25 <= 35.5) {
    aqi = linearScale(pm25, 12.1, 35.5, 51, 100);
  } else if (pm25 <= 55.5) {
    aqi = linearScale(pm25, 35.5, 55.5, 101, 150);
  } else if (pm25 <= 150.5) {
    aqi = linearScale(pm25, 55.5, 150.5, 151, 200);
  } else if (pm25 <= 250.5) {
    aqi = linearScale(pm25, 150.5, 250.5, 201, 300);
  } else {
    aqi = linearScale(pm25, 250.5, 500.5, 301, 500);
  }

  return Math.round(aqi);
}

// Helper function for linear scaling
function linearScale(value, fromLow, fromHigh, toLow, toHigh) {
  return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
}

// Voice search functionality
const voiceSearchBtn = document.getElementById('voice-search-btn');
const input = document.getElementById('input');

if (voiceSearchBtn) {
  if (typeof annyang !== 'undefined') {
    // annyang is available
    const commands = {
      'search for *city': function(city) {
        // Remove any unnecessary punctuation or dots
        const cleanCity = city.replace(/[^\w\s]/g, '').trim();
        input.value = cleanCity;
        getWeather();
      }
    };

    annyang.addCommands(commands);

    voiceSearchBtn.addEventListener('click', function() {
      if (annyang.isListening()) {
        annyang.abort();
        voiceSearchBtn.classList.remove('listening');
      } else {
        annyang.start({ autoRestart: false, continuous: false });
        voiceSearchBtn.classList.add('listening');
      }
    });

    annyang.addCallback('result', function() {
      voiceSearchBtn.classList.remove('listening');
    });

    annyang.addCallback('error', function() {
      voiceSearchBtn.classList.remove('listening');
    });
  } else {
    // annyang is not available, use browser's built-in speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      voiceSearchBtn.addEventListener('click', function() {
        recognition.start();
        voiceSearchBtn.classList.add('listening');
      });

      recognition.onresult = function(event) {
        let result = event.results[0][0].transcript;
        // Clean up the result to remove unnecessary dots or punctuation
        const cleanResult = result.replace(/[^\w\s]/g, '').trim();
        input.value = cleanResult;
        getWeather();
        voiceSearchBtn.classList.remove('listening');
      };

      recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        voiceSearchBtn.classList.remove('listening');
      };

      recognition.onend = function() {
        voiceSearchBtn.classList.remove('listening');
      };
    } else {
      // Neither annyang nor webkitSpeechRecognition is available
      voiceSearchBtn.style.display = 'none';
      console.warn('Speech recognition is not supported in this browser');
    }
  }
}
// ... rest of your existing code ...
window.getWeather = function () {
    // Get the user input from the text box
    var input = document.getElementById("input").value;

    // Get the result div element
    var result = document.getElementById("result");
    var loader = document.getElementById("loader");
    var result_container = document.querySelector(".result-container");
    var hourlyChart = document.getElementById("hourlyChart");
    // var know_more = document.getElementById('km_btn');

    // Hide the result initially
    result.style.display = "none";
    loader.style.display = "block";
    hourlyChart.style.display = "block";

    // Check if the input is not empty
    if (input) {
        // Create a URL for the weather API with the input as a query parameter
        const token = OPENWEATHERMAP_TOKEN;
        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=metric&appid=" + token;

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
                // know_more.style.display = "block";

                // // Add event listener to the dynamically created button
                // document.getElementById('km_btn').addEventListener('click', function () {
                //     // Pass the data to the showContent function
                //     showContent(humidity, wind, visibility, sunrise, sunset, timezoneOffset);
                // });

                // changeBackgroundImage(description);

      // Fetch and display AQI
               getAQI(data.coord.lat, data.coord.lon);
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



// To know more weather data
function showContent(humidity, wind, visibility, sunrise, sunset, timezoneOffset) {
    // Get the result div element
    var result = document.getElementById("result");
    var loader = document.getElementById("loader");
    var result_container = document.querySelector(".result-container");
    // var know_more = document.getElementById('km_btn');

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
    // know_more.style.display = "none";
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
        "fog": "<i class='fas fa-smog'></i>",
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
        "fog": "<i class='fas fa-smog'></i>",
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

window.addEventListener("load", function () {
    const currentYear = new Date().getFullYear();
    document.getElementById("copyrightYear").textContent = currentYear;
});


