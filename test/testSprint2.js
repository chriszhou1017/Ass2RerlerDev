var assert = require('assert');

const newsDao = require('../dao/newsDao.js');


describe('News', function() {
  describe('#insert', function() {
    it('should return with no err when the Insert is success', function() {
      newsDao.insert({"title":"1111","content":"2121222"},function(err,data){
      	 assert.equal(err,null);
      })
    });
  });
});

describe('News', function() {
  describe('#page', function() {
    it('should return with no err when the Count is success', function() {
      newsDao.page({},1,5,function(err,data){
      	 assert.equal(data.length,5);
      })
    });
  });
});