(function() {
  var cli;

  cli = require("commander");

  cli.version("@@version").option("-h, --host [value]", "Redis host", "127.0.0.1").option("-p, --port <n>", "Redis port", 6379).option("-n, --ns [value]", "RSMQ namespace", "rsmq").option("-q, --qname [value]", "RSMQ queuename").command('send [name]', 'send a message').parse(process.argv);

  console.log(cli);

}).call(this);
