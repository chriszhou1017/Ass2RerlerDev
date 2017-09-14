var Article = require("../entity/article.js");
var async = require('async');

var AriticleDao = {};
/**
 * Insert article
 */
AriticleDao.insert=function(article,callback) {
 
    var article= new Article({
        author: article.author,
        title : article.title, 
        journal: article.journal,
        year: article.year,
        volume: article.volume,
        number: article.number,
        pages: article.pages,
        saveDate: new Date(),
        status: 'userUpload'
    });

    article.save(function (err, res) {

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

AriticleDao.count=function(callback){
    article.count(function(err,res){
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
AriticleDao.page=function(queryParams,pageNum,pageSize,callback){
    pageSize=pageSize*1;
    let start = (pageNum - 1) * pageSize;
    let page = {
        pageNumber: pageNum
    };
    async.parallel({
        count: function (done) {  
            Article.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   
            Article.find(queryParams).skip(start).limit(pageSize).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        var count = results.count;
        page.pageCount = (count - 1) / pageSize + 1;
        page.count=count;
        page.results = results.records;
        callback(err, page);
    });
};

AriticleDao.update=function(conditions, update, options, callback){
            Article.update(conditions,update,options,function(err, res){
                    if (!err==null) {
                    callback({status:'ERROR',msgBody:err});
                    }else {
                    callback({status:'OK',msgBody:res});
                        }
    });
}




module.exports = AriticleDao;