const mongoose = require('mongoose'),
    DB_URL = 'mongodb://test:sdm2017@13.59.75.212:27017/test';

/**
 * connect
 */
mongoose.connect(DB_URL);

/**
  * successful connection
  */
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DB_URL);  
});    

/**
 * exception
 */
mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});    
 
/**
 * disconnect
 */
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
});    


module.exports = mongoose;