const { promisify } = require('util');
const User = require('../models/userModel');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

// generate jwt token of _id, with secret string and expire-in
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchError(async (req, res, next) => {
  User.init()
    .then(async () => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
      });
      const result = await user.save();

      const token = signToken(result._id);
      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: result,
        },
      });
    })
    .catch((err) => {
      return next(new AppError(err, 404));
    });

  // THIS DOES NOT WORK WITH UNIQUE PROPERTY IN SCHEMA
  // const newUser = await User.create(req.body);
  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password'), 400);
  }

  // 2) check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) if everything ok, send jwt token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchError(async (req, res, next) => {
  // 1) getting the jwt and check of it's there
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  // 2) verification jwt
  // will throw an error if token is unsignature
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('User is no longer exist', 401));
  }

  // 4) check if user changed password after the jwt was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The user has changed the password. Please log in again',
        401
      )
    );
  }

  // grant access
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchError(async (req, res, next) => {
  // 1) get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address'));
  }

  // 2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send token to user's email
  res.json({
    resetToken,
  });
});

exports.resetPassword = catchError(async (req, res, next) => {});
