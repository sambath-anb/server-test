const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');

// Get 5 top tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Controller to get all tours
exports.getTours = catchError(async (req, res, next) => {
  // execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // send query
  console.log('Success ✅');
  res.status(200).json({
    // 200 OK: The request was successful
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// Controller to create a new tour
exports.createTour = catchError(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  console.log('Success ✅');
  res.status(201).json({
    // 201 Created: The request was successful and a resource was created
    status: 'success',
    data: newTour,
  });
});

// Controller to get a tour by ID
exports.getTourById = catchError(async (req, res, next) => {
  const id = req.params.id;
  // // Alternative
  // // const tour = Tour.findOne({_id: params.id})
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError(`Can't find the tour with ID ${id}`, 404));
  }

  console.log('Success ✅');
  res.status(200).json({
    // 200 OK: The request was successful
    status: 'success',
    data: {
      tour,
    },
  });
});

// Controller to update a tour by ID
exports.updateTourById = catchError(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`Can't find the tour with ID ${id}`, 404));
  }

  console.log('Success ✅');
  res.status(200).json({
    // 200 OK: The request was successful
    status: 'success',
    data: {
      tour,
    },
  });
});

// Controller to delete a tour by ID
exports.deleteTourById = catchError(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError(`Can't find the tour with ID ${id}`, 404));
  }

  console.log('Success ✅');
  res.status(204).json({
    // 204 No Content: The server successfully processed the request, but is not returning any content
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchError(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    // 200 OK: The request was successful
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchError(async (req, res, next) => {
  const year = parseInt(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTouStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTouStarts: -1 },
    },
    {
      $limit: 5, // limit the result to show only 5 items
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
