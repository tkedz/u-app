const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    review: {
        type: String
    },
    screen: {
        type: String,
        required: [true, 'Screen type is required to calculate saved money'],
        enum: [
            '2d',
            '3d',
            'imax2d',
            'imax3d',
            '4dx2d',
            '4dx3d',
            'vip2d',
            'vip3d'
        ]
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Rating must belong to an user']
    },
    movieId: {
        type: String,
        require: [true, 'Provide movie ID']
    },
    movieTitle: {
        type: String,
        require: [true, 'Provide movie title']
    },
    moviePoster: {
        type: String
    }
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
