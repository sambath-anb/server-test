const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');

router.route('/').get(tourController.getTours);

router.route('/').post(tourController.createTour);

router.route('/:id').get(tourController.getTourById);

router.route('/:id').patch(tourController.updateTourById);

router.route('/:id').delete(tourController.deleteTourById);

module.exports = router;