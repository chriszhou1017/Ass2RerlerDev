const mongoose = require('./db/db.js');
const Schema = mongoose.Schema;

let newsSchema = new Schema({                           
    title :  String , 
   	content: String,                      
    saveDate: Date,
    status:   String
});


module.exports = mongoose.model('news',newsSchema);