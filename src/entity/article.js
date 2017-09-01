var mongoose = require('./db/db.js');
var Schema = mongoose.Schema;

var articleSchema = new Schema({          
    title : String ,                   
    title :  String ,                       
    year: Number                       
});


module.exports = mongoose.model('article',articleSchema);