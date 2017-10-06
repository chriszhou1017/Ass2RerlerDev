const mongoose = require('./db/db.js');
const Schema = mongoose.Schema;

let articleCommentSchema = new Schema({          
    rates : Number,                   
    researchMethod : Array, 
    researchMetric : String,                      
    researchParticipants: Array,
    evidenceItem:String,
    editDate:Date,
    articleId: Schema.Types.ObjectId
});


module.exports = mongoose.model('articleComment',articleCommentSchema);