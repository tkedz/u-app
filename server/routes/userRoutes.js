const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const ratingController = require('../controllers/ratingController');
const statsController = require('../controllers/statsController');

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
router.patch(
    '/update-photo',
    authController.checkToken,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.saveUserPhoto
);
router.get('/get-me', authController.checkToken, userController.isLogged);
router.get('/:username', userController.sendUserProfile);
router.get(
    '/:userId/ratings',
    ratingController.getUserRatings,
    ratingController.sendRatingsToClient
);
router.get('/:userId/ratings/:movieId', ratingController.getRating);
router.get(
    '/:userId/stats',
    authController.isProfileOwner,
    ratingController.getUserRatings,
    statsController.calcUserStats
);
router.get('/search/:username', userController.searchUsers);

module.exports = router;
