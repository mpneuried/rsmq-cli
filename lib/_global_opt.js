(function() {
  var cli, globalConf;

  globalConf = require("./_global_conf");

  cli = require("commander");

  cli.version("@@version").usage('<command>');

  module.exports = function(addoptions) {
    if (addoptions == null) {
      addoptions = false;
    }
    if (addoptions) {
      cli.option("-h, --host [value]", "Redis host", "127.0.0.1").option("-p, --port <n>", "Redis port", 6379).option("-n, --ns [value]", "RSMQ namespace", "rsmq").option("-q, --qname <n>", "RSMQ queuename").option("-g, --group [value]", "Client config group");
    }
    return cli;
  };

}).call(this);
