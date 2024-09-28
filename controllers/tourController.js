const Tour = require('./../models/tourModel');

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

// Controller to get all tours
exports.getTours = async (req, res) => {
  try {
    // FOR REFERENCE ONLY
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // });
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    // build query
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let query = Tour.find(queryObj);

    // sort results
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Fields Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(', ').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTour = await Tour.countDocuments();
      if (skip > numTour) {
        console.log('Error 💥');
        return res.status(500).json({
          // 500 Internal Server Error: The server encountered an error
          status: 'fail',
          message: 'This page does not exist!',
        });
      }
    }
    query = query.skip(skip).limit(limit);

    // execute query
    const tours = await query;

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
