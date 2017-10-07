var News = require("../entity/news.js");
var async = require('async');
var NewsDao = {};


NewsDao.insert=function(_news,callback) {
 
    var news= new News({
        title : _news.title, 
        content: _news.content,
        status:"normal",
        saveDate: new Date()
    });

    news.save(function (err, res) {

        if (err) {
            callback({status:'ERROR',msgBody:err});
            console.log("Error:" + err);
        }
        else {
            callback({status:'OK',msgBody:res});
            console.log("Res:" + res);
        }

    });
};

NewsDao.page=function(queryParams,pageNum,pageSize,callback){
    pageSize=pageSize*1;
    let start = (pageNum - 1) * pageSize;
    let page = {
        pageNumber: pageNum
    };
    async.parallel({
        count: function (done) {  
            News.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   
            News.find(queryParams).skip(start).limit(pageSize).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        var count = results.count;
        page.pageCount = count / pageSize ;
        page.count=count;
        page.results = results.records;
        callback(err, page);
    });
};

NewsDao.update=function(conditions, update, options, callback){
            News.update(conditions,update,options,function(err, res){
                    if (!err==null) {
                    callback({status:'ERROR',msgBody:err});
                    }else {
                    callback({status:'OK',msgBody:res});
                        }
    });
}




module.exports = NewsDao;