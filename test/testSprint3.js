var assert = require('assert');
const mongoose = require('mongoose');
const acommentDao = require('../dao/articleCommentDao.js');


describe('Comment', function() {
  describe('#insert', function() {
    it('should return with no err when the Insert is success', function() {
      acommentDao.insert({"rates":"1"},function(err,data){
      	 assert.equal(err,null);
      })
    });
  });
});

describe('Comment', function() {
  describe('#findByArticleId', function() {
    it('should return with no err when the Find is success', function() {
      let articleId=mongoose.Types.ObjectId("59d776c08ebdf91980146d90");
      acommentDao.findByArticleId({"articleId":articleId},function(err,data){
      	 assert.equal(data.length,1);
      })
    });
  });
});