(function() {
  var Module, _, call, exec, path, qname, should, utils,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  exec = require('child_process').exec;

  should = require('should');

  _ = require("lodash");

  utils = require("../lib/utils");

  Module = require("../.");

  qname = utils.randomString(10, 1);

  call = function() {
    var _k, _path, _v, ag, args, cb, cmds, i, j, len, opts;
    args = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), cb = arguments[i++];
    cmds = [];
    opts = {};
    for (j = 0, len = args.length; j < len; j++) {
      ag = args[j];
      if (_.isString(ag) || _.isNumber(ag)) {
        cmds.push(ag);
      } else if (_.isObject(ag)) {
        opts = ag;
      }
    }
    if (process.env["global"] != null) {
      _path = ["rsmq"];
    } else {
      _path = [path.resolve(__dirname, "../bin/rsmq.js")];
    }
    _path = _path.concat(cmds);
    for (_k in opts) {
      _v = opts[_k];
      if (_k.length === 1) {
        _path.push("-" + _k);
      } else {
        _path.push("--" + _k);
      }
      if (_v != null) {
        _path.push(_v);
      }
    }
    exec(_path.join(" "), function(err, stdout, stderr) {
      if (err) {
        cb(err);
        return;
      }
      if (stderr != null ? stderr.length : void 0) {
        cb(stderr);
        return;
      }
      cb(null, stdout);
    });
  };

  describe("----- rsmq-cli TESTS -----", function() {
    before(function(done) {
      done();
    });
    after(function(done) {
      done();
    });
    describe('Main Tests', function() {
      var _ids;
      _ids = [];
      it("create queue", function(done) {
        call("create", {
          "q": qname
        }, function(err, result) {
          should.not.exist(err);
          should.exist(result);
          result.should.equal("1");
          done();
        });
      });
      it("create queue a second time", function(done) {
        call("create", {
          "q": qname
        }, function(err, result) {
          should.exist(err);
          err.should.containEql("queueExists");
          done();
        });
      });
      it("send one message", function(done) {
        call("send", {
          "q": qname
        }, "abc", function(err, result) {
          var ids;
          should.not.exist(err);
          ids = result.split("\n");
          ids.should.have.length(1);
          _ids.push(ids[0]);
          done();
        });
      });
      it("send multiple messages", function(done) {
        call("sn", {
          "q": qname
        }, "xyz1", "xyz2", "xyz3", function(err, result) {
          var ids;
          should.not.exist(err);
          ids = result.split("\n");
          ids.should.have.length(3);
          _ids = _ids.concat(ids);
          done();
        });
      });
      it("receive a messages", function(done) {
        call("receive", {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.rc.should.eql(1);
          _data.message.should.eql("abc");
          done();
        });
      });
      it("receive another messages", function(done) {
        call("rc", {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.rc.should.eql(1);
          _data.message.should.eql("xyz1");
          done();
        });
      });
      it("get queue count", function(done) {
        call("count", {
          "q": qname
        }, function(err, result) {
          should.not.exist(err);
          should.exist(result);
          result.should.equal("4");
          done();
        });
      });
      it("delete a message", function(done) {
        call("delete", _ids[0], {
          "q": qname
        }, function(err, result) {
          var ids;
          should.not.exist(err);
          ids = result.split("\n");
          ids.should.have.length(1);
          ids[0].should.eql("1");
          done();
        });
      });
      it("get queue count", function(done) {
        call("count", {
          "q": qname
        }, function(err, result) {
          should.not.exist(err);
          should.exist(result);
          result.should.equal("3");
          done();
        });
      });
      it("delete multiple messages", function(done) {
        call("rm", _ids[1], _ids[2], {
          "q": qname
        }, function(err, result) {
          var ids;
          should.not.exist(err);
          ids = result.split("\n");
          ids.should.have.length(2);
          ids[0].should.eql("1");
          ids[1].should.eql("1");
          done();
        });
      });
      it("get queue count", function(done) {
        call("count", {
          "q": qname
        }, function(err, result) {
          should.not.exist(err);
          should.exist(result);
          result.should.equal("1");
          done();
        });
      });
      it("get the queue stats", function(done) {
        call("stats", {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.msgs.should.equal(1);
          _data.hiddenmsgs.should.equal(1);
          _data.totalrecv.should.equal(2);
          _data.totalsent.should.equal(4);
          done();
        });
      });
      it("set queue attribute `vt`", function(done) {
        call("attributes", "vt", 120, {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.vt.should.equal(120);
          _data.msgs.should.equal(1);
          _data.hiddenmsgs.should.equal(1);
          _data.totalrecv.should.equal(2);
          _data.totalsent.should.equal(4);
          done();
        });
      });
      it("get the queue stats", function(done) {
        call("stats", {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.vt.should.equal(120);
          _data.msgs.should.equal(1);
          _data.hiddenmsgs.should.equal(1);
          _data.totalrecv.should.equal(2);
          _data.totalsent.should.equal(4);
          done();
        });
      });
      it("list queues", function(done) {
        call("ls", function(err, queues) {
          var _data;
          should.not.exist(err);
          _data = queues.split("\n");
          if (indexOf.call(_data, qname) < 0) {
            throw "missing queuename";
          }
          done();
        });
      });
    });
  });

}).call(this);
