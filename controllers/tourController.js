const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// Middleware to check if the tour ID is valid
exports.checkTourId = (req, res, next, val) => {
  // Uncomment the following lines to enable ID validation
  // if (val != 1) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  next();
};

// Middleware to check if the request body contains required fields
exports.checkBody = (req, res, next) => {
  // Uncomment the following lines to enable body validation
  // console.log(req.body);
  // if (!req.body.name || !req.body.price) {
  //   return res.status(400).json({
  //     status: 'fail',
  //     message: 'Missing name or price 😥',
  //   });
  // }
  next();
};

// Get 5 top tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Controller to get all tours
exports.getTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.log('Error 💥');
    console.log(err);
    res.status(500).json({
      // 500 Internal Server Error: The server encountered an error
      status: 'fail',
      message: 'Can not find the  tours',
    });
  }
};

// Controller to create a new tour
exports.createTour = async (req, res) => {
  // FOR REFERENCE ONLY
  // const newTour = new Tour({})
  // newTour.save().then(doc => {
  //   console.log('Success ✅', doc);
  // }).catch( err => {
  //   console.log('Error 💥', err)
  // });

  try {
    const newTour = await Tour.create(req.body);
    console.log('Success ✅');
    res.status(201).json({
      // 201 Created: The request was successful and a resource was created
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    console.log('Error 💥');
    console.log(err);
    res.status(400).json({
      // 400 Bad Request: The server could not understand the request due to invalid syntax
      status: 'fail',
      message: 'Can not create a tour',
    });
  }
};

// Controller to get a tour by ID
exports.getTourById = async (req, res) => {
  const id = req.params.id;
  try {
    // Alternative
    // const tour = Tour.findOne({_id: params.id})
    const tour = await Tour.findById(id);

    console.log('Success ✅');
    res.status(200).json({
      // 200 OK: The request was successful
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log('Error 💥');
    console.log(err);
    res.status(404).json({
      // 404 Not Found: The server can not find the requested resource
      status: 'fail',
      message: `Tour not found with id: ${id}`,
    });
  }
};

// Controller to update a tour by ID
exports.updateTourById = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log('Success ✅');
    res.status(200).json({
      // 200 OK: The request was successful
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log('Error 💥');
    console.log(err);
    res.status(400).json({
      // 400 Bad Request: The server could not understand the request due to invalid syntax
      status: 'fail',
      message: `Can not update tour with id: ${id}`,
    });
  }
};

// Controller to delete a tour by ID
exports.deleteTourById = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    console.log('Success ✅');
    res.status(204).json({
      // 204 No Content: The server successfully processed the request, but is not returning any content
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.log('Error 💥');
    console.log(err);
    res.status(400).json({
      // 400 Bad Request: The server could not understand the request due to invalid syntax
      status: 'fail',
      message: `Can not delete tour with id: ${id}`,
    });
  }
};
