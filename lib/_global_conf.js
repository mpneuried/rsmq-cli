(function() {
  var Config, _, _defaults, _names, fs, ini,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require("fs");

  ini = require('ini');

  _ = require('lodash');

  _names = ["port", "host", "ns", "timeout", "qname"];

  _defaults = {
    port: 6379,
    host: "127.0.0.1",
    ns: "rsmq",
    timeout: 3000
  };

  Config = (function(superClass) {
    extend(Config, superClass);

    function Config() {
      this.ERRORS = bind(this.ERRORS, this);
      this.setConfig = bind(this.setConfig, this);
      this.getConfig = bind(this.getConfig, this);
      this.read = bind(this.read, this);
      this.getPath = bind(this.getPath, this);
      this.save = bind(this.save, this);
      this.readConfigContent = bind(this.readConfigContent, this);
      this.writeConfigFile = bind(this.writeConfigFile, this);
      this.initConfigFile = bind(this.initConfigFile, this);
      Config.__super__.constructor.apply(this, arguments);
      this.cnf = this.initConfigFile();
      return;
    }

    Config.prototype.initConfigFile = function() {
      var _asNumber, _cnf, _content, _decoded, _i, _k, _scope, _v, err, i, len;
      try {
        _content = this.readConfigContent();
      } catch (_error) {
        err = _error;
        if (err.message.indexOf("ENOENT") === 0) {
          _content = this.defaultConfig;
          this.writeConfigFile(_content);
        } else {
          throw err;
        }
      }
      _asNumber = [];
      for (_k in _defaults) {
        _v = _defaults[_k];
        if (_.isNumber(_v)) {
          _asNumber.push(_k);
        }
      }
      _decoded = ini.decode(_content);
      for (_scope in _decoded) {
        _cnf = _decoded[_scope];
        for (i = 0, len = _asNumber.length; i < len; i++) {
          _k = _asNumber[i];
          if (!(_cnf[_k] != null)) {
            continue;
          }
          _i = parseInt(_cnf[_k], 10);
          if (!isNaN(_i)) {
            _decoded[_scope][_k] = _i;
          }
        }
      }
      return _decoded;
    };

    Config.prototype.defaultConfig = "[default]\nport=" + _defaults.port + "\nhost=" + _defaults.host + "\nns=" + _defaults.ns + "\ntimeout=" + _defaults.timeout;

    Config.prototype.writeConfigFile = function(_content, cb) {
      if (cb != null) {
        fs.writeFile(this.getPath(), _content, cb);
        return;
      } else {
        return fs.writeFileSync(this.getPath(), _content);
      }
    };

    Config.prototype.readConfigContent = function(cb) {
      if (cb != null) {
        fs.readFile(this.getPath(), cb);
      } else {
        return fs.readFileSync(this.getPath()).toString();
      }
    };

    Config.prototype.save = function(cb) {
      return this.writeConfigFile(ini.encode(this.cnf), cb);
    };

    Config.prototype.getPath = function() {
      var _home;
      _home = process.env["HOME"] || process.env["HOMEPATH"] || process.env["USERPROFILE"];
      return _home + "/.rsmq";
    };

    Config.prototype.read = function(scope) {
      if (scope == null) {
        scope = "default";
      }
      if (scope === "default") {
        return this.cnf[scope];
      }
      return _.extend({}, this.read(), this.cnf[scope]);
    };

    Config.prototype.getConfig = function(_n, scope, cb) {
      var _cnf;
      if (scope == null) {
        scope = "default";
      }
      if (indexOf.call(_names, _n) < 0) {
        this._handleError(cb, "EINVALIDNAME");
        return;
      }
      _cnf = this.read(scope);
      cb(null, _cnf[_n]);
    };

    Config.prototype.setConfig = function(_n, _v, scope, cb) {
      var _def, _iv;
      if (scope == null) {
        scope = "default";
      }
      if (indexOf.call(_names, _n) < 0) {
        this._handleError(cb, "EINVALIDNAME");
        return;
      }
      if (this.cnf[scope] == null) {
        this.cnf[scope] = {};
      }
      if (_v != null) {
        _def = _defaults[_n];
        if (_.isNumber(_def)) {
          _iv = parseInt(_v, 10);
          if (isNaN(_iv)) {
            this._handleError(cb, "ENOTNUMBER");
            return;
          }
          this.cnf[scope][_n] = _iv;
        } else {
          this.cnf[scope][_n] = _v;
        }
      } else if (scope === "default" && (_defaults[_n] != null)) {
        this.cnf[scope][_n] = _defaults[_n];
      } else {
        delete this.cnf[scope][_n];
      }
      this.save((function(_this) {
        return function(err) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, _this.read(scope));
        };
      })(this));
    };

    Config.prototype.ERRORS = function() {
      return this.extend(Config.__super__.ERRORS.apply(this, arguments), {
        "EINVALIDNAME": [400, "Invalid config type. Only `" + (_names.join("`, `")) + "` are allowed. "],
        "ENOTNUMBER": [400, "This configuration has to be a number"]
      });
    };

    return Config;

  })(require("mpbasic")());

  module.exports = new Config();

}).call(this);
