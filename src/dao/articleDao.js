var Article = require("../entity/article.js");

var AriticleDao = {};
/**
 * 插入
 */
AriticleDao.insert=function(callback) {
 
    var article= new Article({
        author:'Runeson',
        title : 'Guidelines for conducting and reportingcase study research in software engineering', 
        year: 2017                                                   
    });

    article.save(function (err, res) {

        if (err) {
            callback(err);
            console.log("Error:" + err);
        }
        else {
            callback({status:'OK',msgBody:res});
            console.log("Res:" + res);
        }

    });
}


module.exports = AriticleDao;