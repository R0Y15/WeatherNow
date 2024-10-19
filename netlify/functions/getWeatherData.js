import dotenv from "dotenv";
dotenv.config({ path: "./netlify/functions/.env" });

export const handler = async (event) => {
  let status = 500;
  try {
    let { city } = event.queryStringParameters;
    const baseUrl = process.env.WEATHER_API_BASE_URL;
    const appKey = process.env.OPENWEATHERMAP_TOKEN;
    const units = process.env.WEATHER_DATA_UNIT;
    const url = `${baseUrl}?q=${city}&appid=${appKey}&units=${units}`;
    let response = await fetch(url);
    if (response.ok) {
      status = response.status;
      let data = await response.json();
      return {
        statusCode: status,
        body: JSON.stringify({
          error: null,
          data: data,
        }),
      };
    } else {
      status = response.status;
      throw new Error(
        `Invalid response code from open weather API: ${response.status}`
      );
    }
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: status,
      body: JSON.stringify({
        error: error.message,
        data: null,
      }),
    };
  }
};
