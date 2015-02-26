(function() {
  var cli, processUtil, rsmq;

  cli = require("./_global_opt")(true);

  cli.usage('stats [options]').parse(process.argv);

  rsmq = require("./_rsmq")(cli);

  processUtil = require("./_process")(rsmq);

  rsmq.stats(processUtil.final);

}).call(this);
