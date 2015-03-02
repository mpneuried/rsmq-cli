(function() {
  var RSMQ, _, _c, _cmd, cli, commands, i, j, len, len1, ref;

  _ = require("lodash");

  cli = require("commander");

  RSMQ = require("./_rsmq");

  cli.version("@@version").option("-h, --host <value>", "Redis host", "127.0.0.1").option("-p, --port <n>", "Redis port", 6379).option("-n, --ns <value>", "RSMQ namespace", "rsmq").option("-q, --qname <n>", "RSMQ queuename").option("-g, --group [value]", "Client config group");

  commands = [
    {
      command: 'create',
      description: 'create a queue',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.create(rsmq.final);
      }
    }, {
      command: ['send <msgs...>', 'sn <msgs...>'],
      description: 'send a message',
      action: function(msgs, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.send(msgs, rsmq.final);
      }
    }, {
      command: ['receive', 'rc'],
      description: 'receive a message',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.receive(rsmq.final);
      }
    }, {
      command: ['delete <ids...>', 'rm <ids...>'],
      description: 'delete one or more messages',
      action: function(ids, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq["delete"](ids, rsmq.final);
      }
    }, {
      command: 'stats',
      description: 'get queue stats',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.stats(rsmq.final);
      }
    }, {
      command: 'count',
      description: 'get number of messages in the queue',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.stats(true, rsmq.final);
      }
    }, {
      command: ['listqueues', 'ls'],
      description: 'list all existing queues',
      action: function(options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.listqueues(rsmq.final);
      }
    }, {
      command: ['visibility <id> <vt>', 'vs <id> <vt>'],
      description: 'list all existing queues',
      action: function(id, vt, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.visibility(id, vt, rsmq.final);
      }
    }, {
      command: ['attributes <name> <value>', 'attr <name> <value>'],
      description: 'list all existing queues',
      action: function(_n, _v, options) {
        var rsmq;
        rsmq = RSMQ(options.parent);
        rsmq.attributes(_n, _v, rsmq.final);
      }
    }, {
      command: 'config <type> <name> <value>',
      description: 'list all existing queues',
      action: function(type, _n, _v, options) {
        console.log("CONFIG", type, _n, _v, options);
      }
    }
  ];

  for (i = 0, len = commands.length; i < len; i++) {
    _cmd = commands[i];
    if (_.isArray(_cmd.command)) {
      ref = _cmd.command;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        _c = ref[j];
        cli.command(_c).description(_cmd.command).action(_cmd.action);
      }
    } else {
      cli.command(_cmd.command).description(_cmd.command).action(_cmd.action);
    }
  }

  cli.parse(process.argv);

}).call(this);
