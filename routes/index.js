var express = require('express');
var router = express.Router();
const checkLogin = require('./checkLogin');

const multer = require('multer');
const upload = multer({
  dest:'uploads/'
})


var casts = require('./casts');
var directors = require('./directors');
var movies = require('./movies');
var admin = require('./admin');
const banner = require('./banner');


/* GET home page. */
router.get('/', function (req, res, next) {
  checkLogin.check(req,res);
  res.render('index');
});

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
router.post('/updateAction', casts.updateAction);

router.get('/directors', directors.defaultRoute);

router.get('/login', admin.defaultRoute);
router.post('/adminLoginAction', admin.adminLoginAction);

router.get('/banner',banner.defaultRoute);
router.get('/addBannerRouter',banner.addBannerRouter);
router.post('/addBannerAction',upload.single('bannerimg'),banner.addBannerAction);

module.exports = router;
