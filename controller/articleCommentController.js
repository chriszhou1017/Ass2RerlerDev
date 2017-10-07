const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const articleCommentDao = require('../dao/articleCommentDao.js');

 
router.post('/saveArticleComment', function (req, res) {
 	let {comment} = req.body;
 	let {articleId}=req.body;

 	comment.articleId=mongoose.Types.ObjectId(articleId);

  articleCommentDao.insert(comment,function(msg){
  	res.set('Content-Type','application/json');
	res.send(msg);
  });
});


router.post('/findArticleCommentByArticleId', function (req, res) {
 	let {articleId}=req.body;

 	articleId=mongoose.Types.ObjectId(articleId);

  articleCommentDao.findByArticleId(articleId,function(msg){
  	res.set('Content-Type','application/json');
	res.send(msg);
  });
});
router.post('/updateArticleComment',function(req,res){
	let {articleId}=req.body;
	let {comment}=req.body;
	
	articleId=mongoose.Types.ObjectId(articleId);
		
	let conditions = {"articleId":articleId};
	let update = comment;
	 articleCommentDao.update(conditions,update,{},function(msg){			
			res.send(msg);
	});

});

module.exports = router;