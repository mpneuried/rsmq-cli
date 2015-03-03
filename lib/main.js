(function() {
  var RSMQ, _, _c, _cl, _cmd, _default, cli, cnf, commands, final, i, j, k, l, len, len1, len2, len3, opts, ref, ref1, ref2, ref3, ref4;

  _ = require("lodash");

  cli = require("commander");

  RSMQ = require("./_rsmq");

  cnf = require("./_global_conf");

  _default = cnf.read();

  cli.version("@@version").option("-h, --host <value>", "Redis host", _default.host || "127.0.0.1").option("-p, --port <n>", "Redis port", _default.port || 6379).option("-n, --ns <value>", "RSMQ namespace", _default.ns || "rsmq").option("-t, --timeout <n>", "Timeout to wait for a redis connection", _default.timeout || 2000).option("-q, --qname <n>", "RSMQ queuename", _default.qname).option("--profile [value]", "Client config profile");

  final = function(fnEnd) {
    return function(err, results) {
      if (err) {
        process.stderr.write(err.name + " : " + err.message);
      } else if (_.isObject(results)) {
        process.stdout.write(JSON.stringify(results, 1, 2));
      } else if (_.isString(results)) {
        process.stdout.write(results);
      } else if (results == null) {
        process.stdout.write("OK");
      } else {
        process.stdout.write(results.toString());
      }
      if (fnEnd != null) {
        fnEnd();
      }
    };
  };

  commands = [
    {
      command: 'create',
      description: 'create a queue',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.create(final(rsmq.quit));
      }
    }, {
      command: ['send <msgs...>', 'sn <msgs...>'],
      description: 'send a message',
      action: function(msgs, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.send(msgs, final(rsmq.quit));
      }
    }, {
      command: ['receive', 'rc'],
      description: 'receive a message',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.receive(final(rsmq.quit));
      }
    }, {
      command: ['delete <ids...>', 'rm <ids...>'],
      description: 'delete one or more messages',
      action: function(ids, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq["delete"](ids, final(rsmq.quit));
      }
    }, {
      command: 'stats',
      description: 'get queue stats',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.stats(final(rsmq.quit));
      }
    }, {
      command: 'count',
      description: 'get number of messages in the queue',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.stats(true, final(rsmq.quit));
      }
    }, {
      command: ['listqueues', 'ls'],
      description: 'list all existing queues',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.listqueues(final(rsmq.quit));
      }
    }, {
      command: ['visibility <id> <vt>', 'vs <id> <vt>'],
      description: 'list all existing queues',
      action: function(id, vt, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.visibility(id, vt, final(rsmq.quit));
      }
    }, {
      command: ['attributes <name> <value>', 'attr <name> <value>'],
      description: 'list all existing queues',
      action: function(_n, _v, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.attributes(_n, _v, final(rsmq.quit));
      }
    }, {
      command: 'config <type> [name] [value]',
      description: 'list all existing queues',
      options: [["-j, --json", "Return format as JSON"]],
      action: function(type, _n, _v, options) {
        var _asString, _final, _profile;
        _final = final();
        _asString = function(cnf) {
          var _k, _s;
          _s = [];
          for (_k in cnf) {
            _v = cnf[_k];
            _s.push(_k + ": " + _v);
          }
          return _s.join("\n");
        };
        _profile = options.profile || options.parent.profile;
        if (type === "set") {
          cnf.setConfig(_n, _v, _profile, function(err, cnf) {
            if (err) {
              _final(err);
              return;
            }
            if (options.json) {
              _final(null, JSON.stringify(cnf));
              return;
            }
            _final(null, _asString(cnf));
          });
          return;
        }
        if (type === "get") {
          cnf.getConfig(_n, _profile, _final);
          return;
        }
        if (type === "ls") {
          cnf = cnf.read(_profile);
          if (options.json) {
            _final(null, JSON.stringify(cnf));
            return;
          }
          _final(null, _asString(cnf));
        }
      }
    }
  ];

  for (i = 0, len = commands.length; i < len; i++) {
    _cmd = commands[i];
    if (_.isArray(_cmd.command)) {
      ref = _cmd.command;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        _c = ref[j];
        _cl = cli.command(_c).description(_cmd.command).action(_cmd.action);
        if ((ref1 = _cmd.options) != null ? ref1.length : void 0) {
          ref2 = _cmd.options;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            opts = ref2[k];
            _cl.option.apply(_cl, opts);
          }
        }
      }
    } else {
      _cl = cli.command(_cmd.command).description(_cmd.command).action(_cmd.action);
      if ((ref3 = _cmd.options) != null ? ref3.length : void 0) {
        ref4 = _cmd.options;
        for (l = 0, len3 = ref4.length; l < len3; l++) {
          opts = ref4[l];
          _cl.option.apply(_cl, opts);
        }
      }
    }
  }

  cli.parse(process.argv);

}).call(this);
