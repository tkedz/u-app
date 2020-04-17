const mongoose = require('mongoose');
const Rating = require('../models/ratingModel');
const ErrorHandler = require('../utils/error');
const prices = require('../utils/prices');

exports.calcUserStats = async (req, res, next) => {
    const { userId } = req.params;

    //from - to dates
    let { from, to } = req.query;
    if (!from || from === 'null') from = new Date(0);
    else from = new Date(from);
    if (!to || to === 'null') to = new Date();
    else to = new Date(to);

    //calculate some stats using mongodb aggregation pipeline
    const stats = await Rating.aggregate([
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
            $facet: {
                genres: [
                    { $unwind: '$movieGenre' },
                    { $sortByCount: '$movieGenre' },
                    { $addFields: { genre: '$_id' } },
                    { $project: { _id: 0 } }
                ],
                countries: [
                    { $unwind: '$movieCountry' },
                    { $sortByCount: '$movieCountry' },
                    { $addFields: { country: '$_id' } },
                    { $project: { _id: 0 } }
                ],
                directors: [
                    { $group: { _id: '$movieDirector', count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                    { $addFields: { director: '$_id' } },
                    { $project: { _id: 0 } }
                ],
                screens: [
                    { $group: { _id: '$screen', count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                    { $addFields: { screen: '$_id' } },
                    { $project: { _id: 0 } }
                ],
                preReleases: [
                    { $match: { preRelease: { $eq: true } } },
                    { $group: { _id: null, count: { $sum: 1 } } }
                ],
                ratings: [
                    { $group: { _id: '$rating', count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                    { $addFields: { rating: '$_id' } },
                    { $project: { _id: 0 } }
                ],
                avgRating: [
                    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
                    { $project: { _id: 0 } }
                ]
            }
        },
        {
            $unwind: {
                path: '$avgRating',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$preReleases',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                avgRating: '$avgRating.avgRating',
                preReleases: '$preReleases.count'
            }
        }
    ]);

    if (!stats) return next(new ErrorHandler(404, 'User didnt rate any movie'));

    //previous middleware provide us plain, non-aggregated user ratings in req.rating
    //it is used to calculate stats that could not be calculated by mongodb aggregation pipeline
    console.log(prices);

    res.status(200).json({ status: 'success', stats });
};
