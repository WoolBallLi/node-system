const { MongoClient } = require('mongodb');
const async = require('async');
const url = require('url');
const md5 = require('md5');

var mongoUrl = 'mongodb://localhost:27017/lsa';

const admin = {
  defaultRoute: (req, res, next) => {
    res.render('login');
  },
  adminLoginAction: (req, res, next) => {
    var { name, pwd } = req.body;
    pwd = md5(pwd);
    console.log(pwd);

    async.waterfall([
      (cb) => {
        MongoClient.connect(mongoUrl, (err, db) => {
          if (err) throw err;
          cb(null, db);
        })
      },
      (db,cb)=>{
        db.collection('admin').find({name,pwd},{}).toArray((err,res)=>{
          if (err) throw err;
          cb(null,res);
          db.close();
        })
      }
    ],(err,result)=>{
      if (err) throw err;
      result.length > 0 ? res.cookie('loginState', 1):res.cookie('loginState', 0);
      res.redirect('/');
    })
  }
}

module.exports = admin;