(function() {
  var cli, processUtil, rsmq;

  cli = require("./_global_opt")(true);

  cli.usage('count [options]').parse(process.argv);

  rsmq = require("./_rsmq")(cli);

  processUtil = require("./_process")(rsmq);

  rsmq.listqueues(processUtil.final);

}).call(this);
