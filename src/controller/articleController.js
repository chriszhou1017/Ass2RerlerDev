const express = require('express');
const router = express.Router();
const aricleDao = require('../dao/articleDao.js');
const aricleFormatHandler= require('../adaptor/referenceFormatHandler.js');


 
router.post('/saveArticle', function (req, res) {
 	let {article} = req.body;

  aricleDao.insert(article,function(msg){
  	res.set('Content-Type','application/json');
	res.send(msg);
  });
});

router.post('/convertApaArticle', function(req, res){
	let {apa} = req.body;
	let apa_obj=aricleFormatHandler.convertApa(apa);
	res.set('Content-Type','application/json');
	res.send({status:'OK',msgBody:apa_obj});
});

router.post('/passArticle',function(req,res){
	let {apa} = req.body;
});



module.exports = router;