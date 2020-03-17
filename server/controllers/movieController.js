const axios = require('axios');
const ErrorHandler = require('../utils/error');

exports.findMovies = async (req, res, next) => {
    try {
        if (!req.params.title)
            return next(new ErrorHandler(400, 'Specify title'));

        const page = req.query.page ? req.query.page : 1;
        const year = req.query.year ? req.query.year : '';

        const result = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${req.params.title}&page=${page}&type=movie&y=${year}`
        );

        if (result.data.Response !== 'True')
            return next(new ErrorHandler(400, 'Nothing found'));

        res.status(200).json({
            status: 'Success',
            data: result.data.Search,
            totalResults: result.data.totalResults
        });
    } catch (err) {
        next(new ErrorHandler(400, err.message));
    }
};

exports.getDetails = async (req, res, next) => {
    try {
        if (!req.params.id)
            return next(new ErrorHandler(400, 'Specify id of a movie'));

        const result = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${req.params.id}`
        );

        if (result.data.Response !== 'True')
            return next(new ErrorHandler(400, 'Movie not found!'));

        res.status(200).json({ status: 'Success', data: result.data });
    } catch (err) {
        next(new ErrorHandler(400, err.message));
    }
};
