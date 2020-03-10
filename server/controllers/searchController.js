const axios = require('axios');
const ErrorHandler = require('../utils/error');

exports.findMovies = async (req, res, next) => {
    try {
        if (!req.params.title)
            return next(new ErrorHandler(400, 'Specify title'));

        const result = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${req.params.title}&page=1&type=movie`
        );

        if (result.data.Response !== 'True')
            return next(new ErrorHandler(400, 'Movie not found!'));

        res.status(200).json({
            status: 'Success',
            data: result.data.Search,
            totalResults: result.data.totalResults
        });
    } catch (err) {
        next(new ErrorHandler(400, err.message));
    }
};
