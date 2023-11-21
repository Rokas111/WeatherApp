import {useEffect, useRef, useContext } from "react";
import {WeatherContext} from "../WeatherData.js";
import {renderCanvas} from "../background/BackgroundRenderer.js";

function WeatherBackground() {
    const canvas = useRef();
    const context = useContext(WeatherContext);
    useEffect(() => {
        const render = () => {
            canvas.current.width = window.innerWidth;
            canvas.current.height = window.innerHeight;
            renderCanvas(canvas.current.getContext("2d"),context.weather_data);
        }
        render();
        window.addEventListener("resize", render);
    },[context.weather_data])

    return <canvas ref={canvas}></canvas>
}
export default WeatherBackground;