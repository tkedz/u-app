const express = require('express');
const authController = require('../controllers/authController');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

router.post('/', authController.checkToken, ratingController.saveRating);
router.patch(
    '/:movieId',
    authController.checkToken,
    ratingController.updateRating
);
router.delete(
    '/:movieId',
    authController.checkToken,
    ratingController.deleteRating
);

module.exports = router;
