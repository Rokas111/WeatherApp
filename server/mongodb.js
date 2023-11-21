const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(process.env.MONGO_CONNECTION);

client.connect().then((res) => console.log("Successfully connected to MongoDB")).catch((err) => { console.log(err); process.exit(1); });

module.exports = client.db("WeatherApp");