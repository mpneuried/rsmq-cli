(function() {
  var cli;

  cli = require("./_global_opt")(false);

  cli.command('send <msgs...> [options]', 'send a message').command('create [options]', 'create a queue').command('receive [options]', 'receive a single message').command('delete <ids...> [msgid]', 'delete a single message').command('stats [options]', 'get queue stats').command('count [options]', 'get number of messages in the queue').command('ls [options]', 'get queue stats').command('visibility [options] <id> <vt>', 'change the visibility of a messages').command('attributes [options] <name> <value>', 'change queue attributes').parse(process.argv);


  /*
  	.command('config [type] [name] [value]', 'change the global attributes')
   */

}).call(this);
