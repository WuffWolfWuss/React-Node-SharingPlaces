const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../util/location");
const Place = require("../models/places");
const User = require("../models/users");
const { default: mongoose } = require("mongoose");

//GET PLACES
const getPlacesById = async (req, res, next) => {
  const placeId = req.params.placeId; //get params of request
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Connect server error.", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place with provided id.",
      404
    );
    return next(error);
  }

  //getters = true add id instead of _id to object
  res.json({ place: place.toObject({ getters: true }) });
};

//GET BY USER
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId; //get params of request
  let places;

  try {
    places = await Place.find({ creator: userId });
    //places = await User.findById(userId).populate('places')
  } catch (err) {
    const error = new HttpError("Connect server error.", 500);
    return next(error);
  }
  //find return cursor to interate in Mongo
  //Mongoose return array, turn to cursor using. cursor
  //Place.find() -> return all places

  if (!places || places.length === 0) {
    const error = new Error("Could not find a place with provided user.");
    error.code = 404;
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

//CREATE NEW PLACE
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  const { title, description, address, creator } = req.body;

  //convert address to coornates
  let coordinatesAPI;
  try {
    coordinatesAPI = await getCoordsForAddress(address);
    if (
      JSON.stringify(coordinatesAPI) === "{}" ||
      coordinatesAPI === undefined
    ) {
      coordinatesAPI = {
        lat: 37.4267861,
        lng: -122.0806032,
      };
    }
  } catch (error) {
    return next(error);
  }

  //const title = req.body.title
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinatesAPI,
    image:
      "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
    creator,
  });

  //check if creator id correct/exist
  const user = await User.findById(creator).catch((err) => console.log(err));

  if (!user) {
    return next(new HttpError("User id not found, create failed", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({ session: sess }); //created place should be save
    user.places.push(createdPlace); //placeId should be added to user as well
    await user.save({ session: sess }); //save changed to user

    //only here, if all task in session above not failed then save to database
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Create failed", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

//UPDATE
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const placeId = req.params.placeId;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Connect server error.", 500);
    return next(error);
  }

  //update
  place.title = title;
  place.description = description;

  //save to database
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Connect server error.", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

//DELETE
const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator"); //populate -> searh the user that also have delete placeid
  } catch (err) {
    const error = new HttpError("No place exist", 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Place not exist", 500));
  }

  //delete

  //We can use places pool and save on creator like that
  //because creator well thanks to populate, gave
  //us the full user object linked to that place.
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await place.deleteOne({ session: sess });
    place.creator.places.pull(place); //remove place from user
    await place.creator.save({ session: sess }); //save update user

    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("Error, could not delete place", 500);
    return next(err);
  }
  //const result = await place.deleteOne().catch((err) => console.log(err));

  res.status(200).json({ message: "Delete place." });
};

exports.getPlacesByUserId = getPlacesByUserId;
exports.getPlacesById = getPlacesById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
