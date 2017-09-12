var Article = require("../entity/article.js");

var AriticleDao = {};
/**
 * 插入
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
}



module.exports = AriticleDao;