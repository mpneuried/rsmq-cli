(function() {
  var cli, processUtil, rsmq;

  cli = require("./_global_opt")(true);

  cli.usage('attributes [options] <name> <value>').parse(process.argv);

  rsmq = require("./_rsmq")(cli);

  processUtil = require("./_process")(rsmq);

  rsmq.attributes(cli.args[0], cli.args[1], processUtil.final);

}).call(this);
