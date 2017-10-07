var assert = require('assert');

const articleDao = require('../dao/articleDao.js');


describe('Article', function() {
  describe('#insert', function() {
    it('should return with no err when the Insert is success', function() {
      articleDao.insert({"article":"1111"},function(err,data){
      	 assert.equal(err,null);
      })
    });
  });
});

describe('Article', function() {
  describe('#count', function() {
    it('should return with no err when the Count is success', function() {
      articleDao.count(function(err,data){
      	 assert.equal(err,null);
      })
    });
  });
});