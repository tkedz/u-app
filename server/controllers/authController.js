const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/error');

exports.checkToken = async (req, res, next) => {
    const header = req.headers.authorization;

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        if (!token) return next(new ErrorHandler(401, 'You are not logged in'));

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            return next(new ErrorHandler(401, 'Token is invalid'));
        }

        //check if user associated with decoded token exists
        const user = await User.findById(decoded.id).select('+password');

        if (!user) return next(new ErrorHandler(401, 'User does not exist'));

        //user will be in next middleware
        req.user = user;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.status(403).json({ status: 'error', message: 'Forbidden route' });
    }
};
