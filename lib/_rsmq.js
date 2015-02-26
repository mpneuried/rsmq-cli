(function() {
  var RSMQCli, RSMQueue, _attributeNames,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  RSMQueue = require("rsmq");

  _attributeNames = ["vt", "delay", "maxsize"];

  RSMQCli = (function(superClass) {
    extend(RSMQCli, superClass);

    RSMQCli.prototype.defaults = function() {
      return this.extend(RSMQCli.__super__.defaults.apply(this, arguments), {
        port: 6379,
        host: "127.0.0.1",
        ns: "rsmq",
        qname: null
      });
    };


    /*	
    	## constructor
     */

    function RSMQCli(options) {
      this.ERRORS = bind(this.ERRORS, this);
      this.quit = bind(this.quit, this);
      this._receive = bind(this._receive, this);
      this._deleteSingle = bind(this._deleteSingle, this);
      this._delete = bind(this._delete, this);
      this._stats = bind(this._stats, this);
      this._attributes = bind(this._attributes, this);
      this._visibility = bind(this._visibility, this);
      this._listqueues = bind(this._listqueues, this);
      this._create = bind(this._create, this);
      this._sendSingle = bind(this._sendSingle, this);
      this._send = bind(this._send, this);
      this.defaults = bind(this.defaults, this);
      RSMQCli.__super__.constructor.apply(this, arguments);
      this.ready = false;
      this.send = this._waitUntil(this._send);
      this.create = this._waitUntil(this._create);
      this.receive = this._waitUntil(this._receive);
      this["delete"] = this._waitUntil(this._delete);
      this.stats = this._waitUntil(this._stats);
      this.listqueues = this._waitUntil(this._listqueues);
      this.visibility = this._waitUntil(this._visibility);
      this.attributes = this._waitUntil(this._attributes);
      this.rsmq = new RSMQueue({
        port: this.config.port,
        host: this.config.host,
        ns: this.config.ns
      });
      this.ready = this.rsmq.connected;
      this.rsmq.on("connect", (function(_this) {
        return function() {
          _this.ready = true;
          _this.emit("ready");
        };
      })(this));
      this.rsmq.on("disconnect", (function(_this) {
        return function() {
          _this.ready = false;
          _this.emit("disconnect");
        };
      })(this));
      return;
    }

    RSMQCli.prototype._send = function(messages, cb) {
      var i, len, msg, ref;
      if (!((ref = this.config.qname) != null ? ref.length : void 0)) {
        this._handleError(cb, "EMISSINGQNAME");
      }
      for (i = 0, len = messages.length; i < len; i++) {
        msg = messages[i];
        this._sendSingle(msg)(cb);
      }
    };

    RSMQCli.prototype._sendSingle = function(msg) {
      return (function(_this) {
        return function(cb) {
          _this.rsmq.sendMessage({
            qname: _this.config.qname,
            message: msg
          }, cb);
        };
      })(this);
    };

    RSMQCli.prototype._create = function(cb) {
      var _args, ref;
      if (!((ref = this.config.qname) != null ? ref.length : void 0)) {
        this._handleError(cb, "EMISSINGQNAME");
      }
      _args = {
        qname: this.config.qname,
        vt: this.config.vt || 30,
        delay: this.config.delay || 0,
        maxsize: this.config.maxsize || 65536
      };
      this.rsmq.createQueue(_args, cb);
    };

    RSMQCli.prototype._listqueues = function(cb) {
      this.rsmq.listQueues((function(_this) {
        return function(err, queues) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, queues.join("\n"));
        };
      })(this));
    };

    RSMQCli.prototype._visibility = function(msgid, vt, cb) {
      var _args, ref;
      if (!((ref = this.config.qname) != null ? ref.length : void 0)) {
        this._handleError(cb, "EMISSINGQNAME");
      }
      if (!(msgid != null ? msgid.length : void 0)) {
        this._handleError(cb, "EINVALIDMSGID");
      }
      if ((vt == null) || isNaN(parseInt(vt, 10))) {
        this._handleError(cb, "EINVALIDVT");
      }
      _args = {
        qname: this.config.qname,
        vt: parseInt(vt, 10),
        id: msgid
      };
      this.rsmq.changeMessageVisibility(_args, cb);
    };

    RSMQCli.prototype._attributes = function(_name, _value, cb) {
      var _args, ref;
      if (!((ref = this.config.qname) != null ? ref.length : void 0)) {
        this._handleError(cb, "EMISSINGQNAME");
      }
      if (!(_name != null ? _name.length : void 0) || indexOf.call(_attributeNames, _name) < 0) {
        this._handleError(cb, "EINVALIDATTRNAME");
      }
      if ((_value == null) || isNaN(parseInt(_value, 10))) {
        this._handleError(cb, "EINVALIDVT");
      }
      _args = {
        qname: this.config.qname
      };
      _args[_name] = parseInt(_value, 10);
      this.rsmq.setQueueAttributes(_args, (function(_this) {
        return function(err, stats) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, JSON.stringify(stats));
        };
      })(this));
    };

    RSMQCli.prototype._stats = function() {
      var _args, args, cb, i, onlycount, ref;
      args = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), cb = arguments[i++];
      onlycount = args[0];
      if (!((ref = this.config.qname) != null ? ref.length : void 0)) {
        this._handleError(cb, "EMISSINGQNAME");
      }
      _args = {
        qname: this.config.qname
      };
      this.rsmq.getQueueAttributes(_args, (function(_this) {
        return function(err, stats) {
          if (err) {
            cb(err);
            return;
          }
          if (onlycount) {
            cb(null, stats.msgs);
          } else {
            cb(null, JSON.stringify(stats));
          }
        };
      })(this));
    };

    RSMQCli.prototype._delete = function(ids, cb) {
      var i, id, len, ref;
      if (!((ref = this.config.qname) != null ? ref.length : void 0)) {
        this._handleError(cb, "EMISSINGQNAME");
      }
      if (!(ids != null ? ids.length : void 0)) {
        this._handleError(cb, "EINVALIDMSGIDS");
      }
      for (i = 0, len = ids.length; i < len; i++) {
        id = ids[i];
        this._deleteSingle(id)(cb);
      }
    };

    RSMQCli.prototype._deleteSingle = function(id) {
      return (function(_this) {
        return function(cb) {
          var _args;
          _args = {
            qname: _this.config.qname,
            id: id
          };
          _this.rsmq.deleteMessage(_args, cb);
        };
      })(this);
    };

    RSMQCli.prototype._receive = function(cb) {
      var _args, ref;
      if (!((ref = this.config.qname) != null ? ref.length : void 0)) {
        this._handleError(cb, "EMISSINGQNAME");
      }
      _args = {
        qname: this.config.qname
      };
      this.rsmq.receiveMessage(_args, (function(_this) {
        return function(err, message) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, JSON.stringify(message));
        };
      })(this));
    };

    RSMQCli.prototype.quit = function() {
      this.rsmq.redis.quit();
    };

    RSMQCli.prototype.ERRORS = function() {
      return this.extend(RSMQCli.__super__.ERRORS.apply(this, arguments), {
        "EMISSINGQNAME": [400, "missing --qname` or `-q` argument"],
        "EINVALIDMSGID": [400, "invalid message id. Please define a message id"],
        "EINVALIDMSGIDS": [400, "invalid message id's. Please define at least one message id"],
        "EINVALIDVT": [400, "invalid message vt. Please define a numeric visibility time"],
        "EINVALIDATTRNAME": [400, "invalid attribute name. Only `" + (_attributeNames.join("`, `")) + "` are allowed."]
      });
    };

    return RSMQCli;

  })(require("mpbasic")());

  module.exports = function(cli) {
    return new RSMQCli(cli);
  };

}).call(this);
