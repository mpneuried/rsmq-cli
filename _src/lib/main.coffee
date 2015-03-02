_ = require( "lodash" )
cli = require( "commander" )
RSMQ = require( "./_rsmq" )
cli
	.version("@@version")
	.option("-h, --host <value>", "Redis host", "127.0.0.1")
	.option("-p, --port <n>", "Redis port", 6379)
	.option("-n, --ns <value>", "RSMQ namespace", "rsmq")
	.option("-q, --qname <n>", "RSMQ queuename")
	.option("-g, --group [value]", "Client config group")

commands = [
	command: 'create'
	description: 'create a queue'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.create( rsmq.final )
		return
,
	command: [ 'send <msgs...>', 'sn <msgs...>' ]
	description: 'send a message'
	action: ( msgs, options )->
		rsmq = RSMQ( options.parent )
		rsmq.send( msgs, rsmq.final )
		return
,
	command: ['receive', 'rc']
	description: 'receive a message'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.receive( rsmq.final )
		return
,
	command: ['delete <ids...>', 'rm <ids...>']
	description: 'delete one or more messages'
	action: ( ids, options )->
		rsmq = RSMQ( options.parent )
		rsmq.delete( ids, rsmq.final )
		return
,
	command: 'stats'
	description: 'get queue stats'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.stats( rsmq.final )
		return
,
	command: 'count'
	description: 'get number of messages in the queue'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.stats( true, rsmq.final )
		return
,
	command: [ 'listqueues', 'ls' ]
	description: 'list all existing queues'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.listqueues( rsmq.final )
		return
,
	command: ['visibility <id> <vt>','vs <id> <vt>']
	description: 'list all existing queues'
	action: ( id, vt, options )->
		rsmq = RSMQ( options.parent )
		rsmq.visibility( id, vt, rsmq.final )
		return
,
	command: ['attributes <name> <value>', 'attr <name> <value>']
	description: 'list all existing queues'
	action: ( _n, _v, options )->
		rsmq = RSMQ( options.parent )
		rsmq.attributes( _n, _v, rsmq.final )
		return
,
	command: 'config <type> <name> <value>'
	description: 'list all existing queues'
	action: ( type, _n, _v, options )->
		console.log "CONFIG", type, _n, _v, options 
		return
]


for _cmd in commands
	if _.isArray( _cmd.command )
		for _c in _cmd.command
			cli
				.command( _c )
				.description( _cmd.command )
				.action _cmd.action
	else
		cli
			.command( _cmd.command )
			.description( _cmd.command )
			.action _cmd.action

cli.parse(process.argv)