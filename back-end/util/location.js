const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyA3aiEQtGp34ZnWohK6p2sk_pd4OC69erg";

async function getCoordsForAddress(address) {
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = res.data;
  let coordinates;

  if (
    !data ||
    data.status === "ZERO_RESULTS" ||
    data.status === "OVER_QUERY_LIMIT"
  ) {
    // const error = new HttpError("Could not find location.", 422);
    // throw error;
    return coordinates;
  }

  if (data) {
    //console.log(data);
    //console.log(data.results[0]);
    //console.log(data.results[0].geometry);
    console.log(data.results[0].geometry.location);
    coordinates = data.results[0].geometry.location;
  }
  return coordinates;
}

module.exports = getCoordsForAddress;
