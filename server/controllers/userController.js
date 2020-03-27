const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/error');
const errorController = require('./errorController');
const Email = require('../utils/email');

const createJWT = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION
    });
};

const createResetToken = user => {
    const token = crypto.randomBytes(16).toString('hex');
    user.passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    user.passwordResetTokenExpiration = Date.now() + 3600000;
    return token;
};

exports.register = async (req, res, next) => {
    try {
        //checking if email or username are not taken
        let user = await User.findOne({ email: req.body.email });
        if (user) return next(new ErrorHandler(200, 'Email is already taken'));
        user = await User.findOne({ username: req.body.username });
        if (user)
            return next(new ErrorHandler(200, 'Username is already taken'));

        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            discount: req.body.discount,
            unlimited: req.body.unlimited
        });

        await newUser.save();
        res.json({
            status: 'Success',
            message: 'User created'
        });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
        const user = await User.findOne({
            email
        }).select('+password');

        if (!user)
            return next(new ErrorHandler(404, 'Invalid email or passowrd'));

        const passwdComparision = await bcrypt.compare(password, user.password);

        if (!passwdComparision)
            return next(new ErrorHandler(404, 'Invalid email or password'));

        const token = createJWT(user._id);

        res.status(200).json({
            status: 'Success',
            message: 'User logged in',
            token
        });
    } else return next(new ErrorHandler(400, 'Missing email or password'));
};

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new ErrorHandler(404, 'User not found'));

    //create reset token
    const token = createResetToken(user);

    //try to send an email
    try {
        const url = `${req.protocol}://localhost:8080/reset-password/${token}`;
        await Email.sendPasswordReset(user.email, url);
        //save user with reset token when sending an email went good
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: 'Reset token sent to email'
        });
    } catch (err) {
        console.log(err);
        return next(
            new ErrorHandler(500, 'Something went wrong with sending an email')
        );
    }
};

exports.resetPassword = async (req, res, next) => {
    const token = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            return next(
                new ErrorHandler(401, 'Token is invalid or has expired')
            );
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password changed'
        });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};

exports.updateProfile = async (req, res, next) => {
    //user is already here in req.user
    const { user } = req;

    //if user changes unlimited data there is no need to confirm it with password
    if (req.body.whatsChanged !== 'unlimited') {
        if (!req.body.password)
            return next(
                new ErrorHandler(
                    401,
                    'Provide current password to chenge your profile'
                )
            );

        const passwdComparision = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwdComparision)
            return next(new ErrorHandler(401, 'Invalid password'));
    }

    try {
        switch (req.body.whatsChanged) {
            case 'password':
                user.password = req.body.newPassword;
                user.passwordConfirm = req.body.newPasswordConfirm;
                await user.save();
                break;
            case 'email':
                //check if email isnt taken
                // eslint-disable-next-line no-case-declarations
                const email = await User.findOne({
                    _id: { $ne: user.id },
                    email: req.body.email
                });

                if (email)
                    return next(
                        new ErrorHandler(200, 'Email is already taken')
                    );

                await User.findByIdAndUpdate(
                    user.id,
                    { email: req.body.email },
                    { runValidators: true }
                );
                break;
            case 'unlimited':
                await User.findByIdAndUpdate(
                    user.id,
                    {
                        unlimited: req.body.unlimited,
                        discount: req.body.discount
                    },
                    { runValidators: true }
                );
                break;
            default:
                break;
        }

        res.status(200).json({
            status: 'success',
            message: 'User data has been changed'
        });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};

exports.isLogged = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        user: {
            email: req.user.email,
            username: req.user.username,
            discount: req.user.discount,
            unlimited: req.user.unlimited
        },
        isLogged: true
    });
};

exports.getUserProfile = async (req, res, next) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return next(new ErrorHandler(404, 'User does not exist'));

    res.status(200).json({
        status: 'success',
        user: { username: user.username, unlimited: user.unlimited }
    });
};
