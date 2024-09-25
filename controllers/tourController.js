exports.getTours = (req, res) => {
    res.json({
        status: 'success',
        message: 'get tours'
    })
};

exports.createTour = (req, res) => {
    res.json({
        status: 'success',
        message: 'create a tour'
    })
};

exports.getTourById = (req, res) => {
    const params = req.params;
    res.json({
        status: 'success',
        message: `get a tour by id: ${params.id}`
    })
};

exports.updateTourById = (req, res) => {
    const params = req.params;
    res.json({
        status: 'success',
        message: `update a tour by id: ${params.id}`
    })
};

exports.deleteTourById = (req, res) => {
    const params = req.params;
    res.json({
        status: 'success',
        message: `delete a tour by id: ${params.id}`
    })
};