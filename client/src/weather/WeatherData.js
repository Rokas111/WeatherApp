import {createContext} from "react";
import Cookie from "js-cookie";

export const WeatherContext = createContext();

function kelvinToCelsius(kelvin) {
    return String(Math.floor(kelvin - 273.15));
}

function parseWeatherData(weather_data,forecast) {
    return {
        date: forecast ? new Date(weather_data.dt*1000) : new Date(),
        temp: kelvinToCelsius(weather_data.main.temp),
        feels_like: kelvinToCelsius(weather_data.main.feels_like),
        humidity: weather_data.main.humidity,
        pressure: weather_data.main.pressure,
        cloudiness: weather_data.clouds.all,
        wind: weather_data.wind,
        visibility: weather_data.visibility,
        weather: weather_data.weather.map((weather) => {
            return {name: weather.description.split(" ").map((str) => str.substr(0,1).toUpperCase()+str.slice(1)).join(" "), img: weather.icon, id: weather.id}
        }),
        sunrise: !forecast ? new Date(weather_data.sys.sunrise*1000) : null,
        sunset: !forecast ? new Date(weather_data.sys.sunset*1000) : null
    }
}

export async function fetchCurrentWeatherData() {
    const data = await (await fetch("https://weatherappbackend-q6ju.onrender.com/api/current_weather", {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `bearer ${Cookie.get("jwt_token")}`
        })
    })).json();
    return parseWeatherData(data);
}
export async function fetchForecastData() {
    const data = await (await fetch("https://weatherappbackend-q6ju.onrender.com/api/forecast", {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `bearer ${Cookie.get("jwt_token")}`
        })
    })).json();
    return data.list.map((weather_data) => {
        const parsed_data = parseWeatherData(weather_data,true);
        parsed_data.sunrise = new Date(data.city.sunrise*1000);
        parsed_data.sunset = new Date(data.city.sunset*1000);
        parsed_data.sunrise.setFullYear(parsed_data.date.getFullYear());
        parsed_data.sunrise.setMonth(parsed_data.date.getMonth());
        parsed_data.sunrise.setDate(parsed_data.date.getDate());
        parsed_data.sunset.setFullYear(parsed_data.date.getFullYear());
        parsed_data.sunset.setMonth(parsed_data.date.getMonth());
        parsed_data.sunset.setDate(parsed_data.date.getDate());
        return parsed_data;
    });
}