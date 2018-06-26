var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');
const checkLogin = require('./checkLogin');

var mongoUrl = 'mongodb://localhost:27017/lsa';

const movies = {
  defaultRoute: (req, res, next) => {
    checkLogin.check(req,res);
    async.waterfall([
      (cb) => {
        MongoClient.connect(mongoUrl, (err, db) => {
          if (err) throw err;
          cb(null, db);
        })
      },
      (db, cb) => {
        db.collection('movies').distinct('year',(err,yearArr)=>{
          if (err) throw err;
          yearArr.sort((a,b)=>{
            return a - b;
          })
          cb(null,yearArr,db)
        })
      },
      (yearArr, db, cb) => {
        db.collection('movies').find({}, { _id: 0 }).toArray((err, res) => {
          if (err) throw err;
          cb(null, {
            res,
            yearArr
          })
          db.close();
        })
      }
    ], (err, result) => {
      if (err) throw err;
      res.render('movies', {
        result: result.res,
        yearArr: result.yearArr
      })
    })
  },
  sortMovies: (req, res, next) => {
    checkLogin.check(req,res);
    var { type, num } = url.parse(req.url, true).query;
    var sortObj = {};
    num = num * 1;
    try {
      sortObj[type] = num;
    } catch (error) {

    }
    async.waterfall([
      (cb) => {
        MongoClient.connect(mongoUrl, (err, db) => {
          if (err) throw err;
          cb(null, db);
        })
      },
      (db,cb)=>{
        db.collection('movies').distinct('year',(err,yearArr)=>{
          if (err) throw err;
          yearArr.sort((a,b)=>{
            return a - b ;
          })
          cb(null,yearArr,db);
        })
      },
      (yearArr,db, cb) => {
        db.collection('movies').find({}, { _id: 0 }).sort(sortObj).toArray((err, res) => {
          if (err) throw err;
          cb(null, {
            res,
            yearArr
          });
          db.close();
        })
      }
    ], (err, result) => {
      if (err) throw err;
      res.render('movies', {
        result: result.res,
        yearArr: result.yearArr,
      })
    })
  },
  areaQueryMovies: (req, res, next) => {
    checkLogin.check(req,res);
    var { type, min, max } = url.parse(req.url, true).query;
    var whereObj = {};
    min = min * 1;
    max = max * 1;
    try {
      whereObj[type] = {
        $gte: min,
        $lte: max
      }
    } catch (error) {

    }

    async.waterfall([
      (cb) => {
        MongoClient.connect(mongoUrl, (err, db) => {
          if (err) throw err;
          cb(null, db);
        })
      },
      (db, cb) => { 
        db.collection('movies').distinct('year', (err, yearArr) => {
          if (err) throw err;
          yearArr.sort((a, b) => {
            return a - b;
          })
          cb(null, yearArr, db);
        })
      },
      (yearArr, db, cb) => {
        db.collection('movies').find(whereObj, { _id: 0 }).toArray((err, res) => {
          if (err) throw err;
          cb(null, {
            res,
            yearArr
          });
          db.close();
        })
      }
    ], (err, result) => {
      if (err) throw err;
      res.render('movies', {
        result: result.res,
        yearArr:result.yearArr
      })
    })
  },
  searchMovies: (req, res, next) => {
    checkLogin.check(req,res);
    var { type, val } = url.parse(req.url, true).query;
    var whereObj = {};
    try {
      whereObj[type] = eval("/" + val + "/");
      console.log(whereObj);
    } catch (error) {

    }

    async.waterfall([
      (cb) => {
        MongoClient.connect(mongoUrl, (err, db) => {
          if (err) throw err;
          cb(null, db);
        })
      },
      (db, cb) => { 
        db.collection('movies').distinct('year', (err, yearArr) => {
          if (err) throw err;
          yearArr.sort((a, b) => {
            return a - b;
          })
          cb(null, yearArr, db);
        })
      },
      (yearArr, db, cb) => {
        db.collection('movies').find(whereObj, { _id: 0 }).toArray((err, res) => {
          if (err) throw err;
          cb(null, {
            res,
            yearArr
          });
          db.close();
        })
      }
    ], (err, result) => {
      if (err) throw err;
      res.render('movies', {
        result: result.res,
        yearArr:result.yearArr
      })
    })
  },
  getYearMovies:(req,res,next)=>{
    checkLogin.check(req,res);
    var {year} = url.parse(req.url,true).query;
    year = year *1;
    async.waterfall([
      (cb)=>{
        MongoClient.connect(mongoUrl,(err,db)=>{
          if (err) throw err;
          cb(null,db);
        })
      },
      (db, cb) => { 
        db.collection('movies').distinct('year', (err, yearArr) => {
          if (err) throw err;
          yearArr.sort((a, b) => {
            return a - b;
          })
          cb(null, yearArr, db);
        })
      },
      (yearArr, db, cb) => {
        db.collection('movies').find({year:year},{_id:0}).toArray((err,res)=>{
          if (err) throw err;
          cb(null,{
            res,
            yearArr
          });
          db.close();
        })
      }
    ],(err,result)=>{
      if (err) throw err;
      res.render('movies',{
        result:result.res,
        yearArr:result.yearArr
      })
    })
  }
}

module.exports = movies;
