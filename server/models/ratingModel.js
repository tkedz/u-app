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
    preRelease: {
        type: Boolean,
        required: [true, 'Specify if movie was watched before premiere']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Rating must belong to an user']
    },
    movieId: {
        type: String,
        required: [true, 'Provide movie ID']
    },
    movieTitle: {
        type: String,
        required: [true, 'Provide movie title']
    },
    movieReleased: {
        type: Date,
        required: [true, 'Provide movie release date']
    },
    movieDirector: {
        type: String,
        required: [true, 'Provide movie director']
    },
    moviePoster: {
        type: String,
        required: [true, 'Provide movie poster']
    },
    movieRuntime: {
        type: Number,
        required: [true, 'Provide movie runtime']
    },
    movieGenre: {
        type: Array,
        required: [true, 'Provide movie genre']
    },
    movieCountry: {
        type: Array,
        required: [true, 'Provide movie country']
    },
    discount: {
        type: String,
        enum: ['student', 'regular', 'senior', 'veteran'],
        default: 'regular',
        required: [true, 'Provide type of discount']
    }
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
