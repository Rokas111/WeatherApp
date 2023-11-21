const mongo_db = require("../mongodb.js");

const MONGO_COLLECTION = "weather";
const CURRENT_FORECAST_UPDATE_TIME = 1800000;
const DAY5_FORECAST_UPDATE_TIME = 1800000;
const CURRENT_FORECAST_DOCUMENT_ID = "current_data";
const DAY5_FORECAST_DOCUMENT_ID = "five_day_data";
const TARGET_LOCATION = [55.7348,24.3575];

module.exports.getCurrentWeatherData = async () => {
    let document = await mongo_db.collection(MONGO_COLLECTION).findOne({_id: CURRENT_FORECAST_DOCUMENT_ID});
    if (!document || !document["data"] || !document["upload_date"] || ((new Date()).getTime() - Number(document["upload_date"])) >= CURRENT_FORECAST_UPDATE_TIME) {
        const weather_data = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${TARGET_LOCATION[0]}&lon=${TARGET_LOCATION[1]}&appid=${process.env.API_KEY}`)).json();
        const new_document_data = {
            _id: CURRENT_FORECAST_DOCUMENT_ID,
            upload_date: (new Date()).getTime(),
            data: weather_data
        };

        if (document) {
            await mongo_db.collection(MONGO_COLLECTION).updateOne({_id: CURRENT_FORECAST_DOCUMENT_ID},{$set: new_document_data}) 
        } else {
            await mongo_db.collection(MONGO_COLLECTION).insertOne(new_document_data) 
        }
        document = await mongo_db.collection(MONGO_COLLECTION).findOne({_id: CURRENT_FORECAST_DOCUMENT_ID});
    }

    return document["data"];
}

module.exports.getFiveDayForecast = async () => {
    let document = await mongo_db.collection(MONGO_COLLECTION).findOne({_id: DAY5_FORECAST_DOCUMENT_ID});
    if (!document || !document["data"] || !document["upload_date"] || ((new Date()).getTime() - Number(document["upload_date"])) >= DAY5_FORECAST_UPDATE_TIME) {
        const weather_data = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${TARGET_LOCATION[0]}&lon=${TARGET_LOCATION[1]}&appid=${process.env.API_KEY}`)).json();
        const new_document_data = {
            _id: DAY5_FORECAST_DOCUMENT_ID,
            upload_date: (new Date()).getTime(),
            data: weather_data
        };

        if (document) {
            await mongo_db.collection(MONGO_COLLECTION).updateOne({_id: DAY5_FORECAST_DOCUMENT_ID},{$set: new_document_data}) 
        } else {
            await mongo_db.collection(MONGO_COLLECTION).insertOne(new_document_data) 
        }
        document = await mongo_db.collection(MONGO_COLLECTION).findOne({_id: DAY5_FORECAST_DOCUMENT_ID});
    }

    return document["data"];
}