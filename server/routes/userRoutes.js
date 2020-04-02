const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.patch('/reset-password/:token', userController.resetPassword);
router.patch(
    '/update-profile',
    authController.checkToken,
    userController.updateProfile
);
router.get('/get-me', authController.checkToken, userController.isLogged);
router.get('/:username', userController.getUserProfile);
router.get('/:userId/ratings/:movieId', ratingController.getRating);

module.exports = router;
