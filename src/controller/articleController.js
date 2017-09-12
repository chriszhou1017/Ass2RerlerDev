const express = require('express');
const router = express.Router();
const aricleDao = require('../dao/articleDao.js');


router.post('/saveArticle', function (req, res) {
 	let {article} = req.body;

  aricleDao.insert(article,function(msg){
  	res.set('Content-Type','application/json');
	res.send(msg);
//	req.pipe(res);
  });
});

module.exports = router;