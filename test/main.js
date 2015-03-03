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
    describe('Default Tests', function() {
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
      it("send a message to a not existing queue", function(done) {
        call("send", {
          "q": qname + "_false"
        }, "abc", function(err, result) {
          should.exist(err);
          err.should.containEql("queueNotFound");
          done();
        });
      });
      it("send a message to a wrong namespace", function(done) {
        call("send", {
          "q": qname + "_false",
          ns: "abc"
        }, "abc", function(err, result) {
          should.exist(err);
          err.should.containEql("queueNotFound");
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
          _data.hiddenmsgs.should.equal(0);
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
          _data.hiddenmsgs.should.equal(0);
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
          _data.hiddenmsgs.should.equal(0);
          _data.totalrecv.should.equal(2);
          _data.totalsent.should.equal(4);
          done();
        });
      });
      it("set queue attribute `delay`", function(done) {
        call("attributes", "delay", 5, {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.vt.should.equal(120);
          _data.delay.should.equal(5);
          _data.msgs.should.equal(1);
          _data.hiddenmsgs.should.equal(0);
          _data.totalrecv.should.equal(2);
          _data.totalsent.should.equal(4);
          done();
        });
      });
      it("set queue attribute `maxsize`", function(done) {
        call("attributes", "maxsize", 1024, {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.vt.should.equal(120);
          _data.delay.should.equal(5);
          _data.maxsize.should.equal(1024);
          _data.msgs.should.equal(1);
          _data.hiddenmsgs.should.equal(0);
          _data.totalrecv.should.equal(2);
          _data.totalsent.should.equal(4);
          done();
        });
      });
      it("get the queue stats again", function(done) {
        call("stats", {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.vt.should.equal(120);
          _data.delay.should.equal(5);
          _data.maxsize.should.equal(1024);
          _data.msgs.should.equal(1);
          _data.hiddenmsgs.should.equal(0);
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
      it("change a message visibility", function(done) {
        call("vs", _ids[3], 3, {
          "q": qname
        }, function(err, result) {
          should.not.exist(err);
          result.should.eql("1");
          done();
        });
      });
      it("try to receive the messages", function(done) {
        call("rc", {
          "q": qname
        }, function(err, result) {
          result.should.eql("{}");
          done();
        });
      });
      it("get the queue stats to check hidden msg", function(done) {
        call("stats", {
          "q": qname
        }, function(err, result) {
          var _data;
          should.not.exist(err);
          _data = JSON.parse(result);
          _data.vt.should.equal(120);
          _data.delay.should.equal(5);
          _data.maxsize.should.equal(1024);
          _data.msgs.should.equal(1);
          _data.hiddenmsgs.should.equal(1);
          _data.totalrecv.should.equal(2);
          _data.totalsent.should.equal(4);
          done();
        });
      });
      it("try to receive the messages after timeout (`vt`)", function(done) {
        this.timeout(5000);
        setTimeout(function() {
          call("rc", {
            "q": qname
          }, function(err, result) {
            var _data;
            should.not.exist(err);
            _data = JSON.parse(result);
            _data.rc.should.eql(1);
            _data.message.should.eql("xyz3");
            done();
          });
        }, 3000);
      });
    });
    describe('Config Tests', function() {
      var _conf;
      _conf = null;
      it("get the current config", function(done) {
        call("config", "ls", function(err, result) {
          should.not.exist(err);
          result.should.containEql("port:");
          result.should.containEql("host:");
          result.should.containEql("ns:");
          result.should.containEql("timeout:");
          done();
        });
      });
      it("get the current config as json", function(done) {
        call("config", "ls", {
          "json": null
        }, function(err, result) {
          should.not.exist(err);
          _conf = JSON.parse(result);
          _conf.port.should.be.type('number');
          _conf.host.should.be.type('string');
          _conf.ns.should.be.type('string');
          _conf.timeout.should.be.type('number');
          done();
        });
      });
    });
  });

}).call(this);
