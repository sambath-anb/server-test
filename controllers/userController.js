const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchError = require('../utils/catchError');

exports.updateUser = catchError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for updating password. Please visit /updatepassword'
      )
    );
  }
});

exports.getUsers = catchError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.json({
    status: 'success',
    message: 'create a user',
  });
};

exports.getUserById = (req, res) => {
  const params = req.params;
  res.json({
    status: 'success',
    message: `get a user by id: ${params.id}`,
  });
};

exports.updateUserById = (req, res) => {
  const params = req.params;
  res.json({
    status: 'success',
    message: `update a user by id: ${params.id}`,
  });
};

exports.deleteUserById = (req, res) => {
  const params = req.params;
  res.json({
    status: 'success',
    message: `delete a user by id: ${params.id}`,
  });
};
