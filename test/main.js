(function() {
  var Module, _moduleInst, should;

  should = require('should');

  Module = require("../.");

  _moduleInst = null;

  describe("----- rsmq-cli TESTS -----", function() {
    before(function(done) {
      _moduleInst = new Module();
      done();
    });
    after(function(done) {
      done();
    });
    describe('Main Tests', function() {
      it("first test", function(done) {
        done();
      });
    });
  });

}).call(this);
