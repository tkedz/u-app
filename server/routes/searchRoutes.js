const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

router.get('/:title', searchController.findMovies);

module.exports = router;
