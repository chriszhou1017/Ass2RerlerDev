const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const newsDao = require('../dao/newsDao.js');


router.post('/saveNews', function (req, res) {
 	let {news} = req.body;

  newsDao.insert(news,function(msg){
  	res.set('Content-Type','application/json');
	res.send(msg);
  });
});

router.get('/pageNews',function(req,res){
	let {pageNum} = req.query;
	let {pageSize} = req.query;
	
	newsDao.page({'status':'normal'},pageNum,pageSize,function(_err,_data){
		if(_err==null)
	res.send({status:'OK',msgBody:_data});
		else
	res.send({status:'ERROR',msgBody:_err});
	});
});

router.post('/updateNews',function(req,res){
	let {id} = req.body;
	let {title}=req.body;
	let {content}=req.body;
	
	id=mongoose.Types.ObjectId(id);
		
	let conditions = {"_id":id};
	let update = {"title":title,"content":content};
	let option={multi:true};
	newsDao.update(conditions,update,option,function(msg){			
			res.send(msg);
	});

});

router.post('/delNews',function(req,res){
	let {id} = req.body;
	
	id=mongoose.Types.ObjectId(id);
		
	let conditions = {"_id":id};
	let update = {"status":"deleted"};
	let option={multi:true};
	newsDao.update(conditions,update,option,function(msg){			
			res.send(msg);
	});

});




module.exports = router;