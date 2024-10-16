const User = require('../models/userModel');
const catchError = require('../utils/catchError');

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
