var express = require('express');
var router = express.Router();

var casts = require('./casts');
var directors = require('./directors');
var movies = require('./movies');


/* GET home page. */

router.get('/movies', movies.defaultRoute);
router.get('/sortMovies', movies.sortMovies);
router.get('/areaQueryMovies', movies.areaQueryMovies);
router.get('/searchMovies', movies.searchMovies);
router.get('/getYearMovies', movies.getYearMovies);

router.get('/casts', casts.defaultRoute);
router.get('/castspaging', casts.castspaging);
router.get('/delCasts', casts.delCasts);
router.get('/addCasts', casts.addCasts);
router.post('/addAction', casts.addAction);
router.get('/updateCasts', casts.updateCasts);
router.get('/getCastData', casts.getCastData);
router.post('/updateAction', casts.updateAction);

router.get('/directors', directors.defaultRoute);



module.exports = router;
