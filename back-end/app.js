const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

//import route
const placesRoute = require("./routes/places-route");
const usersRoute = require("./routes/user-route");

const app = express();

//parse and extract any json data from request
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use(placesRoute); //app.use('/api/place' , placesRoute); => http:5000/api/place/user/:userId
app.use("/api/user", usersRoute);

//middleware handle resquest that have no response
app.use((req, res, next) => {
  const error = new HttpError("Route not exist", 404);
  throw error;
});

//function will trigger when any middleware yield an error
app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "Unknown error" });
});

const url =
  "mongodb+srv://<MongoDB-Username>:<Your-MongoDB-Password>@cluster0.qxzxpg4.mongodb.net/places_mern?retryWrites=true&w=majority";

mongoose
  .connect(url)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
