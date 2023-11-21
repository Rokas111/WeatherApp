import {useContext,useRef} from "react";
import {WeatherContext} from "../WeatherData.js";
import Slider from "../../components/Slider";
import "../../weatherIconApi/css/weather-icons.min.css";
import {calculateTimeOfDay} from "../background/utils/WeatherUtils.js";

const TIME_OF_DAY = [["Daytime","wi wi-day-sunny"], ["Nighttime","wi wi-night-clear"], ["Sunrise","wi wi-sunrise"], ["Sunset", "wi wi-sunset"]];

const SHORTENED_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov","Dec"];

function WeatherPage() {
    const context = useContext(WeatherContext);

    const formatTime = (hours,minutes) => {
        return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`
    }

    const formatDouble = (number,afterDot) => {
        return (!String(number).includes(".")) ? String(number) : `${String(number).split(".")[0]}.${String(number).split(".")[1].slice(0,afterDot)}`
    }

    const formatForecastDate = (date) => {
        return `${date.getDate()}th ${SHORTENED_MONTH_NAMES[date.getMonth()]}`
    }

    const selectForecast = (weather) => {
        context.setWeatherData(weather);
    }

    const time_of_day_index = calculateTimeOfDay(context.weather_data.sunrise,context.weather_data.sunset,context.weather_data.date);

    return <><div className="weather_info_header">
            <div className="weather_info_header_text">
                <div className="weather_info_header_upper_text">
                    <div className="location_wrap">
                        <i className="fa-solid fa-location-dot"></i>
                        <p>Panevėžys</p>
                    </div>
                </div>
                <div className="weather_info_header_main_text">
                    <h1>{context.weather_data.weather[0].name}</h1>
                </div>
                <div className="weather_info_header_lower_text">
                    <div className="weather_info_header_lower_text_info">
                        <p>{context.weather_data.temp}°C</p>
                        <i className={TIME_OF_DAY[time_of_day_index][1]}></i>
                        <p>{TIME_OF_DAY[time_of_day_index][0]}</p>
                    </div>
                    {context.weather_data.weather.length > 1?(<div className="weather_info_additional">
                        {context.weather_data.weather.slice(1).map((weather) => <div className="weather_info_additional_wrap" key={weather.name}>
                            <i className={`wi wi-owm-${weather.id}`}></i>
                            <p className="weather_info_additional_text">{weather.name}</p>
                        </div>)}
                    </div>):("")}
                </div>
            </div>
            <div className="weather_info_header_img_column">
                <div className="weather_info_header_img_wrap">
                        <img src={`weather/${context.weather_data.weather[0].img}.png`}/>
                </div>
            </div>
        </div>
        <Slider>
            {context.forecast_data.map((weather,i) => {
                return <div className="forecast_data" onClick={() => selectForecast(weather)} key={`forecast_${i}`}>
                    <img src={`weather/${weather.weather[0].img}.png`}/>
                    <p>{formatForecastDate(weather.date)}</p>
                    <p>{formatTime(weather.date.getHours(),weather.date.getMinutes())}</p>
                    <p>{weather.temp}°C</p>
                </div>
            })}
        </Slider>
        <div className="weather_info_details">
            <div className="weather_info_details_box">
                <div className="weather_info_details_box_img_wrap">
                    <i className="wi wi-thermometer-exterior"></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Temperature</p>
                    <p>{context.weather_data.temp}°C <span className="feels_like">(Feels Like {context.weather_data.feels_like}°C)</span> </p>
                </div>
            </div>
            <div className="weather_info_details_box weather_info_humidity">
                <div className="weather_info_details_box_img_wrap">
                    <i className="wi wi-raindrop"></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Humidity</p>
                    <p>{context.weather_data.humidity}%</p>
                </div>
            </div>
            <div className="weather_info_details_box">
                <div className="weather_info_details_box_img_wrap">
                    <i className="fa-solid fa-location-arrow" style={{
                        "transform": `rotate(calc(-45deg + ${context.weather_data.wind.deg}deg))`
                    }}></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Wind</p>
                    <p>{String(context.weather_data.wind.speed).includes(".")?String(context.weather_data.wind.speed).split(".")[0]:context.weather_data.wind.speed}m/s {context.weather_data.wind.deg}°</p>
                </div>
            </div>
            <div className="weather_info_details_box">
                <div className="weather_info_details_box_img_wrap">
                    <i className="fa-regular fa-eye"></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Visibility</p>
                    <p>{formatDouble(context.weather_data.visibility/1000,1)} km</p>
                </div>
            </div>
            <div className="weather_info_details_box">
                <div className="weather_info_details_box_img_wrap">
                    <i className="wi wi-barometer"></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Pressure</p>
                    <p>{context.weather_data.pressure} hPa</p>
                </div>
            </div>
            <div className="weather_info_details_box">
                <div className="weather_info_details_box_img_wrap">
                    <i className="wi wi-cloudy"></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Cloudiness</p>
                    <p>{context.weather_data.cloudiness}%</p>
                </div>
            </div>
            <div className="weather_info_details_box">
                <div className="weather_info_details_box_img_wrap">
                    <i className="wi wi-sunrise"></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Sunrise</p>
                    <p>{formatTime(context.weather_data.sunrise.getHours(),context.weather_data.sunrise.getMinutes())}</p>
                </div>
            </div>
            <div className="weather_info_details_box">
                <div className="weather_info_details_box_img_wrap">
                    <i className="wi wi-sunset"></i>
                </div>
                <div className="weather_info_details_box_text_wrap">
                    <p>Sunset</p>
                    <p>{formatTime(context.weather_data.sunset.getHours(),context.weather_data.sunset.getMinutes())}</p>
                </div>
            </div>
        </div>
    </>
}
export default WeatherPage;