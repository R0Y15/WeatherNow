// JavaScript code for fetching and displaying the weather data

function getWeather() {
  // Get the user input from the text box
  var input = document.getElementById("input").value;

  // Get the result div element
  var result = document.getElementById("result");

  // Hide the result initially
  result.style.display = "none";

  // Check if the input is not empty
  if (input) {
    // Create a URL for the weather API with the input as a query parameter
    const token = "236bb39302420003220a7db6c237c584";
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

        html =
          "<p><span class='label'>Temperature:</span> <span class='value'>" +
          temp +
          " °C " +
          getTemperatureIcon(description) +
          "</span></p>";
        html +=
          "<p><span class='label'>Feels Like:</span> <span class='value'>" +
          feels_like +
          " °C</span></p>";
        html +=
          "<p><span class='label'>Humidity:</span> <span class='value'>" +
          humidity +
          " % <i class='fas fa-tint fa-lg'></i></span></p>";
        html +=
          "<p><span class='label'>Wind:</span> <span class='value'>" +
          wind +
          " m/s <i class='fas fa-wind fa-lg'></i></span></p>";
        html +=
          "<p><span class='label'>Description:</span> <span class='value'>" +
          description +
          getWeatherIcon(description) +
          "</span></p>";

        // Set the inner HTML of the result div to the HTML string
        result.innerHTML = html;

        // Show the result div
        result.style.display = "block";
      })
      .catch(function (error) {
        // Handle any errors that may occur
        alert(error.message);
      });
  } else {
    // Alert the user if the input is empty
    alert("Please enter a city name");
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


document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
})
