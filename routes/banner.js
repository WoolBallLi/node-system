const { MongoClient } = require('mongodb');
const async = require('async');
const url = require('url');

const fs = require('fs');
const checkLogin = require('./checkLogin');

var mongoUrl = 'mongodb://localhost:27017/lsa';

let banner = {
  defaultRoute: (req, res, next) => {
    checkLogin.check(req, res);
    res.render('banner');
  },
  addBannerRouter: (req, res, next) => {
    checkLogin.check(req, res);
    res.render('banner_add');
  },
  addBannerAction: (req, res, next) => {
    checkLogin.check(req, res);
    // console.log("req.body", req.body);
    //     console.log("req.file", req.file);
    let { bannerid, bannerurl } = req.body;
    let oldName = './uploads/' + req.file.filename;
    let finishFlagArr = req.file.originalname.split('.');
    let finishFlag = finishFlagArr[finishFlagArr.length - 1];
    let newName = './uploads/' + req.file.filename + '.' + finishFlag;

    async.waterfall([
      (cb) => {
        fs.rename(oldName, newName, (err, data) => {
          if (err) throw err;
          let imgUrl = req.file.filename + '.' + finishFlag;
          cb(null, imgUrl);
        })
      },
      (imgUrl, cb) => {
        console.log("1111", { bannerid, bannerurl, imgUrl })

        MongoClient.connect(mongoUrl, (err, db) => {
          if (err) throw err;
          cb(null, imgUrl, db)
        })
      },
      (imgUrl, db, cb) => {
        console.log("222",{ bannerid, bannerurl, imgUrl })

        db.collection('banners').insert({ bannerid, bannerurl, imgUrl }, (err, res) => {
          if (err) throw err;
          cb(null, 'ok');
          db.close();
        })
      }
    ], (err, result) => {
      if (err) throw err;
      if (result == 'ok') {
        res.redirect('/banner');
      }
    })
  }
}

module.exports = banner;