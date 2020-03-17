const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/search/:title', movieController.findMovies);
router.get('/:id', movieController.getDetails);

module.exports = router;
