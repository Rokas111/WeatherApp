import {useState,useEffect} from "react";
import { WeatherContext, fetchCurrentWeatherData, fetchForecastData } from "../WeatherData";
import WeatherBackground from "./WeatherBackground";
import Loading from "../../components/Loading";
import Header from "./Header";
import WeatherInfo from "./WeatherInfo";

function WeatherPage() {
    const [weather_data,setWeatherData] = useState(null);
    const [forecast_data,setForecastData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            return [await fetchCurrentWeatherData(),(await fetchForecastData())];
        }
        loadData().then(([weather_data,forecast_data]) => {
            setWeatherData(weather_data);
            setForecastData(forecast_data);
        }).catch((err) => console.log(err));
    },[]);

    return (weather_data && forecast_data) ? <div className="background_wrap">
        <WeatherContext.Provider value={{weather_data,forecast_data,setWeatherData}}>
            <WeatherBackground></WeatherBackground>
            <div className="canvas_overlay">
                <Header />
                <WeatherInfo />
            </div>
        </WeatherContext.Provider>
    </div> : <Loading />
}
export default WeatherPage;