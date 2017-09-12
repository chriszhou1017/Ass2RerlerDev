var mongoose = require('./db/db.js');
var Schema = mongoose.Schema;

var articleSchema = new Schema({          
    author : String ,                   
    title :  String , 
    journal: String,                      
    year: Number,
    volume: Number,
    number: Number,
    pages:String,
    saveDate:Date,
    status:String
});


module.exports = mongoose.model('article',articleSchema);