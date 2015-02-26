(function() {
  var cli, processUtil, rsmq;

  cli = require("./_global_opt")(true);

  cli.usage('recieve [options]').option("-t, --timeout <n>", "receive timeout").parse(process.argv);

  rsmq = require("./_rsmq")(cli);

  processUtil = require("./_process")(rsmq);

  rsmq.receive(processUtil.final);

}).call(this);
