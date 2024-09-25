exports.checkTourId = (req, res, next, val) => {
  if (val != 1) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log(req.body);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price 😥'
    })
  }
  next();
};

exports.getTours = (req, res) => {
  res.json({
    status: "success",
    message: "get tours",
  });
};

exports.createTour = (req, res) => {
  res.json({
    status: "success",
    message: "create a tour",
  });
};

exports.getTourById = (req, res) => {
  const params = req.params;
  res.json({
    status: "success",
    message: `get a tour by id: ${params.id}`,
  });
};

exports.updateTourById = (req, res) => {
  const params = req.params;
  res.json({
    status: "success",
    message: `update a tour by id: ${params.id}`,
  });
};

exports.deleteTourById = (req, res) => {
  const params = req.params;
  res.json({
    status: "success",
    message: `delete a tour by id: ${params.id}`,
  });
};
