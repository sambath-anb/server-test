const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');

router.route('/').get(userController.getUsers);

router.route('/').post(userController.createUser);

router.route('/:id').get(userController.getUserById);

router.route('/:id').patch(userController.updateUserById);

router.route('/:id').delete(userController.deleteUserById);

module.exports = router;