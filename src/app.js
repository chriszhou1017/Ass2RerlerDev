var express = require('express');
var aricleDao = require('./dao/articleDao.js');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/saveArticle', function (req, res) {
  aricleDao.insert(function(msg){

	res.send(msg);

  });


});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});