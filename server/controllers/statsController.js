/* eslint-disable */
const mongoose = require('mongoose');
const Rating = require('../models/ratingModel');
const ErrorHandler = require('../utils/error');
const priceList = require('../utils/prices');
const { getUserProfile } = require('./userController');

exports.calcUserStats = async (req, res, next) => {
    const { userId } = req.params;

    //from - to dates
    let { from, to } = req.query;
    if (!from || from === 'null') from = new Date(0);
    else from = new Date(from);
    if (!to || to === 'null') to = new Date();
    else to = new Date(to);

    //calculate some stats using mongodb aggregation pipeline
    let stats = await Rating.aggregate([
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
                ],
                "timeCount": [
                    { $group: { _id: null, timeCount: { $sum: "$movieRuntime" } } },
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
            $unwind: {
                path: "$timeCount",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                avgRating: '$avgRating.avgRating',
                preReleases: '$preReleases.count',
                timeCount: "$timeCount.timeCount"
            }
        }
    ]);

    if (!stats) return next(new ErrorHandler(404, 'User didnt rate any movie'));

    stats = stats[0];

    //previous middleware provide us plain, non-aggregated user ratings in req.ratings
    //it is used to calculate stats that could not be calculated by mongodb aggregation pipeline
    const user = await getUserProfile(req);

    //calculate amount of money user spent on unlimited subscription
    const currentDate = new Date(to);
    const currentDay = parseInt(currentDate.toDateString().split(' ')[2], 10);

    let unlimitedDate;
    //from = new Date(2017, 11, 12);
    if (from.getTime() < user.unlimited.getTime()) {
        unlimitedDate = user.unlimited;
    } else {
        unlimitedDate = new Date(from);
    }

    const unlimitedDay = parseInt(
        user.unlimited.toDateString().split(' ')[2],
        10
    );

    let months = (currentDate.getFullYear() - unlimitedDate.getFullYear()) * 12 + (currentDate.getMonth() - unlimitedDate.getMonth()) + 1;
    if (currentDay < unlimitedDay) months -= 1;

    //calc money spent on subscription
    stats.subscription = 0;
    const loop = new Date(unlimitedDate);
    for (let i = 0; i < months; i += 1) {
        //console.log('PETLA: ' + months);
        for (let j = 0; j < priceList.unlimited.length; j += 1) {
            if (
                (priceList.unlimited[j].to && loop.getTime() >=
                        new Date(priceList.unlimited[j].from).getTime() &&
                    loop.getTime() <=
                        new Date(priceList.unlimited[j].to).getTime()) ||
                (!priceList.unlimited[j].to &&
                    loop.getTime() >=
                        new Date(priceList.unlimited[j].from).getTime())
            ) {
               // console.log('MIESIAC: ' + loop.getMonth());
                //console.log('CENA: ' + priceList.unlimited[j][user.region]);
                stats.subscription += priceList.unlimited[j][user.region];
                loop.setMonth(loop.getMonth() + 1);
                break;
            }
        }
    }

    //calc money that the user would spend without a subscription
    stats.moneyWoSubscription = 0;
    req.ratings.forEach(el => {
        if(el.date.getTime() >= unlimitedDate) {
            
            let validPrices, validUnlimited

            for (let j = 0; j < priceList.prices.length; j += 1) {
                if (
                    (priceList.prices[j].to && el.date.getTime() >=
                            new Date(priceList.prices[j].from).getTime() &&
                        el.date.getTime() <=
                            new Date(priceList.prices[j].to).getTime()) ||
                    (!priceList.prices[j].to &&
                        el.date.getTime() >=
                            new Date(priceList.prices[j].from).getTime())
                ) {
                    validPrices = priceList.prices[j];
                    break;
                }
            }

            for (let j = 0; j < priceList.unlimited.length; j += 1) {
                if (
                    (priceList.unlimited[j].to && el.date.getTime() >=
                            new Date(priceList.unlimited[j].from).getTime() &&
                        el.date.getTime() <=
                            new Date(priceList.unlimited[j].to).getTime()) ||
                    (!priceList.unlimited[j].to &&
                        el.date.getTime() >=
                            new Date(priceList.unlimited[j].from).getTime())
                ) {
                    validUnlimited = priceList.unlimited[j];
                    break;
                }
            }

            let week = 'week';
            if([0, 6].includes(el.date.getDay())) week = 'weekend';
            else if([3].includes(el.date.getDay())) week = 'wednesday';
            
            stats.moneyWoSubscription += validPrices[el.screen][user.region][week][user.discount];

            stats.subscription += validUnlimited[el.screen];
        }
    });

    res.status(200).json({ status: 'success', stats });
};
