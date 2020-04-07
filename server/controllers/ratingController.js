const mongoose = require('mongoose');
const Rating = require('../models/ratingModel');
const ErrorHandler = require('../utils/error');
const errorController = require('../controllers/errorController');
const { checkIfMovieExists } = require('../controllers/movieController');

exports.getRating = async (req, res, next) => {
    const { userId, movieId } = req.params;

    const rating = await Rating.findOne({ user: userId, movieId });

    if (!rating)
        return next(
            new ErrorHandler(404, 'There is no rating for movie with given id')
        );

    res.status(200).json({ status: 'success', rating });
};

exports.getAllUserRatings = async (req, res, next) => {
    const { userId } = req.params;

    //sort order
    let { order } = req.query;
    order = parseInt(order, 10);
    if (order !== 1 && order !== -1) order = 1;

    //from - to dates
    let { from, to } = req.query;
    if (from === 'null') from = new Date(0);
    else from = new Date(from);
    if (to === 'null') to = new Date();
    else to = new Date(to);

    const ratings = await Rating.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                date: {
                    $gte: from,
                    $lte: to
                }
            }
        },
        {
            $sort: {
                [req.query.sort]: order
            }
        }
    ]);

    if (!ratings)
        return next(new ErrorHandler(404, 'User didnt rate any movie'));

    res.status(200).json({ status: 'success', ratings });
};

exports.deleteRating = async (req, res, next) => {
    const { movieId } = req.params;

    try {
        await Rating.deleteOne({ user: req.user._id, movieId });
        res.status(200).json({ status: 'success', message: 'Rating deleted' });
    } catch (err) {
        console.log(err);
    }
};

exports.saveRating = async (req, res, next) => {
    if (!req.body.rating || !req.body.screen || !req.body.date)
        return next(new ErrorHandler(400, 'Provide rating/date/screen type'));

    if (!req.body.movieId || !req.body.movieTitle || !req.body.moviePoster)
        return next(new ErrorHandler(400, 'Provide movie id/title/poster'));

    const rating = req.body;
    rating.user = req.user._id;

    const movieExists = await checkIfMovieExists(rating.movieId);
    if (!movieExists)
        return next(new ErrorHandler(404, 'Movie does not exist'));

    try {
        //create new document or update if it exists (upsert option)
        await Rating.findOneAndUpdate(
            { user: rating.user, movieId: rating.movieId },
            rating,
            { upsert: true, runValidators: true, useFindAndModify: false }
        );

        res.status(200).json({
            status: 'success',
            message: 'Rating added/updated'
        });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};
