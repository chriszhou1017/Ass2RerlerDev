const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const articleDao = require('../dao/articleDao.js');
const aricleFormatHandler= require('../adaptor/referenceFormatHandler.js');


 
router.post('/saveArticle', function (req, res) {
 	let {article} = req.body;

  articleDao.insert(article,function(msg){
  	res.set('Content-Type','application/json');
	res.send(msg);
  });
});

router.get('/pageUnselectedArticle',function(req,res){
	let {pageNum} = req.query;
	let {pageSize} = req.query;
	const unselectedQuery={status:'userUpload'};
	articleDao.page(unselectedQuery,pageNum,pageSize,function(_err,_data){
		if(_err==null)
	res.send({status:'OK',msgBody:_data});
		else
	res.send({status:'ERROR',msgBody:_err});
	});
});


router.post('/convertApaArticle', function(req, res){
	let {apa} = req.body;
	let apa_obj=aricleFormatHandler.convertApa(apa);
	res.set('Content-Type','application/json');
	res.send({status:'OK',msgBody:apa_obj});
});



router.post('/passArticle',function(req,res){
	let {ids} = req.body;
	for(let i=0,max=ids.lenght;i<max;i++){

		let id=mongoose.Types.ObjectId(ids[i]);
		ids[i]=id;
	}
	let conditions = {"_id":{$in:ids}};
	let update = {"status":"accepted"};
	let option={multi:true};
	articleDao.update(conditions,update,option,function(msg){			
			res.send(msg);
		
			
	});

});

router.post('/rejectArticle',function(req,res){
	let {ids} = req.body;
	for(let i=0,max=ids.lenght;i<max;i++){

		let id=mongoose.Types.ObjectId(ids[i]);
		ids[i]=id;
	}
	let conditions = {"_id":{$in:ids}};
	let update = {"status":"rejected"};
	let option={multi:true};
	articleDao.update(conditions,update,option,function(msg){			
			res.send(msg);
	});

});





module.exports = router;