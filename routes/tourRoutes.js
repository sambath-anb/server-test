const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');

// Get top 5 tours
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getTours);

router
  .route('/')
  .get(tourController.getTours)
  .post(tourController.checkBody, tourController.createTour);

// param middleware
router.param('id', tourController.checkTourId);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTourById)
  .delete(tourController.deleteTourById);

module.exports = router;
