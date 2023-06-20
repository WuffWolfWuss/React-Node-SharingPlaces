const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/users");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //get all exclude password
  } catch (error) {
    return next(new HttpError("Fetching data failed", 500));
  }
  //const users = User.find({}, 'name email') //only get info of name and email
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//SIGN UP
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const { name, email, password } = req.body;

  const existUser = await User.findOne({ email: email }).catch((error) =>
    console.log(error)
  );

  if (existUser) {
    const error = new HttpError("Email already exist", 400);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Create user failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

//LOGIN
const login = async (req, res, next) => {
  const { email, password } = req.body;

  const existUser = await User.findOne({ email: email }).catch((error) =>
    console.log(error)
  );

  if (!existUser || existUser.password !== password) {
    const error = new HttpError("Wrong email or password", 401);
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
