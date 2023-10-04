// JavaScript code for fetching and displaying the weather data
function getWeather() {
    // Get the user input from the text box
    var input = document.getElementById("input").value;

    // Check if the input is not empty
    if (input) {
        // Create a URL for the weather API with the input as a query parameter
        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=metric&appid=236bb39302420003220a7db6c237c584";

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
                var html = "<p><span class='label'>City:</span> <span class='value'>" + city + ", " + country + "</span></p>";
                html += "<p><span class='label'>Temperature:</span> <span class='value'>" + temp + " °C</span></p>";
                html += "<p><span class='label'>Feels Like:</span> <span class='value'>" + feels_like + " °C</span></p>";
                html += "<p><span class='label'>Humidity:</span> <span class='value'>" + humidity + " %</span></p>";
                html += "<p><span class='label'>Wind:</span> <span class='value'>" + wind + " m/s</span></p>";
                html += "<p><span class='label'>Description:</span> <span class='value'>" + description + "</span></p>";

                // Get the result div element and set its inner HTML to the HTML string
                var result = document.getElementById("result");
                result.innerHTML = html;
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
