var express = require('express');
var article= require('./controller/articleController');
var bodyParser = require('body-parser');
var app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/inforEntry', express.static('webapps'));

app.get('/', function (req, res) {
  res.redirect('/inforEntry/userMain.html');
});

app.use("/article",article);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});