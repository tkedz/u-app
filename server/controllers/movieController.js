const axios = require('axios');
const ErrorHandler = require('../utils/error');

exports.checkIfMovieExists = async id => {
    const result = await axios.get(
        `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${id}&plot=full`
    );

    if (result.data.Response === 'False') return false;

    return true;
};

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

        result.data.Search.forEach(el => {
            delete el.Type;
        });

        res.status(200).json({
            status: 'success',
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
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${req.params.id}&plot=full`
        );

        //format rotten tomatoes rating
        result.data.RtRating = 'N/A';
        for (let i = 0; i < result.data.Ratings.length; i += 1) {
            if (result.data.Ratings[i].Source === 'Rotten Tomatoes') {
                if (result.data.Ratings[1]) {
                    result.data.RtRating = result.data.Ratings[1].Value.replace(
                        '%',
                        ''
                    );
                }
                break;
            }
        }

        if (result.data.Response !== 'True')
            return next(new ErrorHandler(400, 'Movie not found!'));

        res.status(200).json({ status: 'success', data: result.data });
    } catch (err) {
        if (process.env.NODE_ENV === 'production')
            return next(new ErrorHandler(400, 'Movie not found!'));
        return next(new ErrorHandler(400, err.message));
    }
};
