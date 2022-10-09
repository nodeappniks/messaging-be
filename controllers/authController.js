const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    message: "User Succesfully register",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ userName }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password!", 401));
  }

  let newUser;
  if (user) {
    newUser = await User.findOne({ userName }).select("-password");
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
