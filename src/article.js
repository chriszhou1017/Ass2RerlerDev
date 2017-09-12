var mongoose = require('./db/db.js');
var Schema = mongoose.Schema;

var articleSchema = new Schema({          
    author : String ,                   
    title :  String ,                       
    year: Number                       
});


module.exports = mongoose.model('article',articleSchema);


