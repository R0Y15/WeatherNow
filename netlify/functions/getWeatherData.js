import dotenv from "dotenv";
dotenv.config({path:'./netlify/functions/.env'});

export const handler = async (event) => {
  try {
    let { city } = event.queryStringParameters;
    const baseUrl = process.env.WEATHER_API_BASE_URL;
    const appKey = process.env.OPENWEATHERMAP_TOKEN;
    const units = process.env.WEATHER_DATA_UNIT;
    const url = `${baseUrl}?q=${city}&appid=${appKey}&units=${units}`;
    let response = await fetch(url);
    let data = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: null,
        data: data,
      }),
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message,
        data: null,
      }),
    };
  }
};