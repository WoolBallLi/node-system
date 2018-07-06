var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');

var mongoUrl = 'mongodb://localhost:27017/lsa';

const casts = {
  defaultRoute: (req, res, next) => {
    async.waterfall([(cb) => {
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        cb(null, db);
      })
    },
    (db, cb) => {
      db.collection('casts').find({}, { _id: 0 }).toArray((err, data) => {
        if (err) throw err;
        cb(null, data);
        db.close();
      });
    }
    ], (err, result) => {
      if (err) throw err;
      res.send(result)
    })
  },
  castspaging: (req, res, next) => {
    var { limitNum, skipNum } = url.parse(req.url, true).query;

    limitNum = limitNum * 1 || 5;
    skipNum = skipNum * 1 || 0;
    async.waterfall([(cb) => {
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        cb(null, db);
      })
    },
    (db, cb) => {
      db.collection('casts').find({}, { _id: 0 }).toArray((err, data) => {
        if (err) throw err;
        //总页数
        var totalNum = Math.ceil(data.length / limitNum);
        //取到数据
        var pagingdata = data.splice(limitNum * skipNum, limitNum);
        cb(null, {
          totalNum,
          data: pagingdata
        });
        db.close();
      })
    }], (err, result) => {
      if (err) throw err;
      var { data, totalNum } = result;
      res.send(data);
    })
  },
  getCastData:( req, res, next ) => {
      
      // res.render('casts_update');
      //先查询填充数据后更新
      var { id, limitNum, skipNum } = url.parse( req.url, true ).query;
      
      async.waterfall( [
        ( cb ) => {
          MongoClient.connect( mongoUrl, ( err, db ) => {
            if ( err ) throw err;
            cb( null, db );
          })
        },
        ( db, cb ) => {
          db.collection('casts').find({id:id}).toArray( ( err, res ) => {
            if ( err ) throw err;
            cb( null, res );
            db.close();
          })
        }
      ], ( err, result ) => {
        if ( err ) throw err;
        res.send(result)
      }
  )},
  delCasts: (req, res, next) => {
    var { id, limitNum, skipNum } = url.parse(req.url, true).query;
    async.waterfall([(cb) => {
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        cb(null, db);
      })
    }, (db, cb) => {
      db.collection('casts').deleteOne({ id: id }, (err, res) => {
        if (err) throw err;
        cb(null, 'ok');
        db.close();
      })
    }
    ], (err, result) => {
      if (err) throw err;
      if (result == 'ok') {
        res.redirect('/castspaging?limitNum' + limitNum + '&skipNum' + skipNum);
      }
    })
  },
  addCasts: (req, res, next) => {
    res.render('casts_add');
  },
  addAction: (req, res, next) => {
    var { id, name, img, alt } = req.body;
    var insertObj = {
      id,
      name,
      alt,
      avatars: {
        small: img,
        large: img,
        medium: img
      }
    }
    async.waterfall([(cb) => {
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        cb(null, db);
      })
    }, (db, cb) => {
      db.collection('casts').insert(insertObj, (err, res) => {
        if (err) throw err;
        cb(null, 'ok');
        db.close()
      })
    }
    ], (err, result) => {
      if (err) throw err;
      if (result = 'ok') {
        res.redirect('/castspaging');
      }
    })
  },
  updateCasts: (req, res, next) => {
    var { id, limitNum, skipNum } = url.parse(req.url, true).query;

    async.waterfall([(cb) => {
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        cb(null, db);
      })
    },
    (db, cb) => {
      db.collection('casts').find({ id: id }, { _id: 0 }).toArray((err, res) => {
        if (err) throw err;
        cb(null, res);
        db.close();
      })
    }], (err, result) => {
      if (err) throw err;
      res.render('casts_update', {
        result,
        limitNum,
        skipNum
      })
    })
  },
  updateAction: (req, res, next) => {
    var { id, name, img, alt, limitNum, skipNum } = req.body;
    var whereObj = { id: id };
    var updateObj = {
      $set: {
        id,
        name,
        alt,
        avatars: {
          small: img,
          large: img,
          medium: img
        }
      }
    };
    async.waterfall([(cb) => {
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        cb(null, db);
      })
    },
    (db, cb) => {
      db.collection('casts').updateOne(whereObj, updateObj, (err, res) => {
        if (err) throw err;
        cb(null, 'ok');
        db.close();
      })
    }], (err, result) => {
      if (err) throw err;
      if (result == 'ok') {
        res.send('ok')
      }
    })
  }
}

module.exports = casts;