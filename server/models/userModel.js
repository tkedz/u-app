const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please tell us your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Wrong email']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Please tell us your username']
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(pwdConfirm) {
                return pwdConfirm === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    unlimited: {
        type: Date
    },
    region: {
        type: String,
        enum: ['warsaw', 'rest'],
        default: 'rest'
    },
    discount: {
        type: String,
        enum: ['student', 'regular', 'senior', 'veteran'],
        default: 'regular'
    },
    passwordResetToken: String,
    passwordResetTokenExpiration: Date
});

//Schema validation goes first, then middlewares
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
