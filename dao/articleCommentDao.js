var ArticleComment = require("../entity/articleComment.js");

var AriticleCommentDao = {};

AriticleCommentDao.insert=function(comment,callback) {
 
    var acomment= new ArticleComment({
        rates : comment.rates,                   
    	researchMethod : comment.rmtd, 
    	researchMetric : comment.rmtc,                      
    	researchParticipants: comment.rp,
    	evidenceItem:comment.ei,
        editDate:new Date(),
    	articleId: comment.articleId
    });

    acomment.save(function (err, res) {

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

AriticleCommentDao.findByArticleId=function(aid,callback) {
            ArticleComment.find({articleId:aid}).limit(1).exec(function (err, res) {
                  if (err) {
            callback({status:'ERROR',msgBody:err});
            console.log("Error:" + err);
                    }
                else {
            callback({status:'OK',msgBody:res[0]});
            console.log("Res:" + res);
                    }
            });

}
AriticleCommentDao.update=function(conditions, update, options, callback){
            ArticleComment.update(conditions,update,options,function(err, res){
                    if (!err==null) {
                    callback({status:'ERROR',msgBody:err});
                    }else {
                    callback({status:'OK',msgBody:res});
                        }
    });
}

module.exports = AriticleCommentDao;