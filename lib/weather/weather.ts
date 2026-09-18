export interface WeatherResult {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
}

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResult> {
  const url = new URL(
    "https://api.open-meteo.com/v1/forecast"
  );

  url.searchParams.set("latitude", latitude.toString());
  url.searchParams.set("longitude", longitude.toString());
  url.searchParams.set(
    "current",
    "temperature_2m,wind_speed_10m,weather_code"
  );

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
  };
}