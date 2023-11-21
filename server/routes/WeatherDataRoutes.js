const weatherDataController = require("../controllers/WeatherDataController.js");

const Router = new (require("express").Router);

Router.get("/api/current_weather",async (req,res) => {
    try {
        res.json(await weatherDataController.getCurrentWeatherData());
    } catch (e) {
        res.json({error: e});
    }
});

Router.get("/api/forecast",async (req,res) => {
    try {
        res.json(await weatherDataController.getFiveDayForecast());
    } catch (e) {
        res.json({error: e});
    }
});

module.exports = Router;