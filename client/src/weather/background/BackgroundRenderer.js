import {calculateTimeOfDay} from "./utils/WeatherUtils.js";
import time_of_day from "./effects/TimeOfDay.js";
import clouds from "./effects/Clouds.js";

let brush;
let weather;

const CLOUDS = {
    "0": 0,
    "11": 1,
    "30": 2,
    "50": 3,
    "80": 4 
}

const THUNDERSTORMS = {
    "thunderstorm with light rain": 2,
    "thunderstorm with rain": 2,
    "thunderstorm with heavy rain": 2,
    "light thunderstorm": 1,
    "thunderstorm": 2,
    "heavy thunderstorm": 3,
    "ragged thunderstorm": 3,
    "thunderstorm with light drizzle": 2,
    "thunderstorm with drizzle": 2,
    "thunderstorm with heavy drizzle": 2
}

const DRIZZLE = {
    "light intensity drizzle": 1,
    "drizzle": 2,
    "heavy intensity drizzle": 3,
    "light intensity drizzle rain": 1,
    "drizzle rain": 2,
    "heavy intensity drizzle rain": 3,
    "shower rain and drizzle": 2,
    "heavy shower rain and drizzle": 2,
    "shower drizzle": 4,
    "thunderstorm with light drizzle": 1,
    "thunderstorm with drizzle": 2,
    "thunderstorm with heavy drizzle": 3
}

const SNOW = {
    "light snow": 1,
    "snow": 2,
    "heavy snow": 3,
    "sleet": 1,
    "freezing rain": 1,
    "light shower sleet": 1,
    "shower sleet": 1,
    "light rain and snow": 2,
    "rain and snow": 2,
    "light shower snow": 2,
    "shower snow": 2,
    "heavy shower snow": 2
}

const RAIN = {
    "light rain": 1,
    "moderate rain": 2,
    "heavy intensity rain": 3,
    "very heavy rain": 4,
    "extreme rain": 5,
    "freezing rain": 1,
    "light intensity shower rain": 3,
    "shower rain": 4,
    "heavy intensity shower rain": 5,
    "ragged shower rain": 5,
    "sleet": 1,
    "light shower sleet": 3,
    "shower sleet": 4,
    "light rain and snow": 1,
    "rain and snow": 2,
    "light shower snow": 3,
    "shower snow": 4,
    "heavy shower snow": 5,
    "light intensity drizzle rain": 2,
    "drizzle rain": 2,
    "heavy intensity drizzle rain": 2,
    "shower rain and drizzle": 4,
    "heavy shower rain and drizzle": 5,
    "thunderstorm with light rain": 1,
    "thunderstorm with rain": 2,
    "thunderstorm with heavy rain": 3
}

const registered_effects = {
    "time_of_day": time_of_day,
    "clouds": clouds
};

const FRAME_LIMITER = 100;
let previous_timestamp;

function parseWeatherData(weather_data) {
    return {
        time_of_day: calculateTimeOfDay(weather_data.sunrise,weather_data.sunset,weather_data.date),
        fog: weather_data.weather.filter((w) => w.name.toLowerCase() == "fog").length > 0,
        mist: weather_data.weather.filter((w) => w.name.toLowerCase() == "mist").length > 0,
        clouds: CLOUDS[Object.keys(CLOUDS).reverse().find((c) => parseInt(c) <= weather_data.cloudiness)],
        snow: weather_data.weather.filter((w) => SNOW.hasOwnProperty(w.name.toLowerCase())).length > 0 ? SNOW[weather_data.weather.find((w) => SNOW.hasOwnProperty(w.name.toLowerCase())).name.toLowerCase()] : 0,
        rain: weather_data.weather.filter((w) => RAIN.hasOwnProperty(w.name.toLowerCase())).length > 0 ? RAIN[weather_data.weather.find((w) => RAIN.hasOwnProperty(w.name.toLowerCase())).name.toLowerCase()] : 0,
        drizzle: weather_data.weather.filter((w) => DRIZZLE.hasOwnProperty(w.name.toLowerCase())).length > 0 ? DRIZZLE[weather_data.weather.find((w) => DRIZZLE.hasOwnProperty(w.name.toLowerCase())).name.toLowerCase()] : 0,
        thunderstorm: weather_data.weather.filter((w) => THUNDERSTORMS.hasOwnProperty(w.name.toLowerCase())).length > 0 ? THUNDERSTORMS[weather_data.weather.find((w) => THUNDERSTORMS.hasOwnProperty(w.name.toLowerCase())).name.toLowerCase()] : 0
    }
}

export function renderCanvas(new_brush,weather_data) {
    brush = new_brush;
    weather = parseWeatherData(weather_data);
    Object.keys(registered_effects).forEach((name) => {
        registered_effects[name].initiate(brush);
    })
    renderFrame();
}

function renderFrame(timestamp) {
    previous_timestamp = timestamp;
    brush.clearRect(0,0,window.innerWidth,window.innerHeight);
    Object.keys(weather).filter((name) => registered_effects.hasOwnProperty(name)).sort((a,b) => {
        return registered_effects[a].options.priority_index - registered_effects[b].options.priority_index
    }).forEach((name) => {
        registered_effects[name].play(weather);
    })
}