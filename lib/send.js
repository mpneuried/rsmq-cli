(function() {
  var cli, processUtil, rsmq;

  cli = require("./_global_opt")(true);

  cli.usage('send <messages...> [options]').parse(process.argv);

  rsmq = require("./_rsmq")(cli);

  processUtil = require("./_process")(rsmq);

  rsmq.send(cli.args, processUtil.final);

}).call(this);
