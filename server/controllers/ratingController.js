/* eslint-disable no-restricted-syntax */
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

exports.getUserRatings = async (req, res, next) => {
    const { userId } = req.params;

    //sort order
    let { order, sort } = req.query;
    order = parseInt(order, 10);
    if (order !== 1 && order !== -1) order = 1;

    //from - to dates
    let { from, to } = req.query;
    if (!from || from === 'null') from = new Date(0);
    else from = new Date(parseInt(from, 10));
    if (!to || to === 'null') to = new Date();
    else to = new Date(parseInt(to, 10));

    req.from = from;
    req.to = to;

    if (sort !== 'date' && sort !== 'rating') sort = 'date';

    //console.log(from, to);

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
                [sort]: order
            }
        }
    ]);

    //console.log(ratings);
    if (ratings.length === 0)
        return next(new ErrorHandler(404, 'User didnt rate any movie'));

    req.ratings = ratings;
    next();
};

exports.sendRatingsToClient = (req, res, next) => {
    //console.log(req.ratings);
    res.status(200).json({ status: 'success', ratings: req.ratings });
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
    // if (!req.body.rating || !req.body.screen || !req.body.date)
    //     return next(new ErrorHandler(400, 'Provide rating/date/screen type'));

    // if (!req.body.movieId || !req.body.movieTitle || !req.body.moviePoster)
    //     return next(new ErrorHandler(400, 'Provide movie Id/Title/Poster'));

    // if (
    //     !req.body.movieGenre ||
    //     !req.body.movieCountry ||
    //     !req.body.movieDirector
    // )
    //     return next(
    //         new ErrorHandler(400, 'Provide movie Genre/Country/Director')
    //     );

    // console.log(req.body);
    // if (!('preRelease' in req.body) || !req.body.discount)
    //     return next(new ErrorHandler(400, 'Provide preRelease/discount'));

    const rating = req.body;
    rating.user = req.user._id;

    const movieExists = await checkIfMovieExists(rating.movieId);
    if (!movieExists)
        return next(new ErrorHandler(404, 'Movie does not exist'));

    try {
        //create new document or update if it exists (upsert option)
        let resultToSave = await Rating.findOne({
            user: rating.user,
            movieId: rating.movieId
        });

        //console.log('rating', rating);
        if (!resultToSave) resultToSave = new Rating(rating);
        else {
            for (const [key, value] of Object.entries(rating)) {
                resultToSave[key] = value;
            }
            //console.log('RESULT TO SAVE', resultToSave);
        }

        await resultToSave.save();

        res.status(200).json({
            status: 'success',
            message: 'Rating added/updated'
        });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};

exports.updateRating = async (req, res, next) => {
    if (!req.params.movieId)
        return next(new ErrorHandler(404, 'Provide movie id'));

    const movieExists = await checkIfMovieExists(req.params.movieId);
    if (!movieExists)
        return next(new ErrorHandler(404, 'Movie does not exist'));

    const updatedRating = req.body;

    try {
        const result = await Rating.findOneAndUpdate(
            { user: req.user._id, movieId: req.params.movieId },
            updatedRating,
            { useFindAndModify: false, runValidators: true }
        );

        //console.log(result);
        if (!result)
            return next(new ErrorHandler(404, 'Please rate this movie first'));

        res.status(200).json({ status: 'success', message: 'Rating updated' });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};
