require("dotenv").config();

const passport = require("./passport.js");
const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(require("./routes/UserRoutes.js"));

app.use(passport.authenticate('jwt', { session: false }))

app.use(require("./routes/WeatherDataRoutes.js"));

app.use((req,res) => res.status(404).send({error:"404 : Page Not found"}));

app.listen(3080);