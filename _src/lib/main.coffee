_isObject = require( "lodash/isObject" )
_isString = require( "lodash/isString" )
_isArray = require( "lodash/isArray" )
cli = require( "commander" )
RSMQ = require( "./_rsmq" )

cnf = require( "./_global_conf" )
_default = cnf.read()

collectCOpts = (val, memo={})->
	[_k,_v] = val.split("=")
	memo[ _k ] = _v
	return memo

cli
	.version("@@version")
	.option("-h, --host <value>", "Redis host" )
	.option("-p, --port <n>", "Redis port", parseInt )
	.option("-n, --ns <value>", "RSMQ namespace" )
	.option("-t, --timeout <n>", "Timeout to wait for a redis connection" )
	.option("-q, --qname <n>", "RSMQ queuename" )
	.option("-g, --group [value]", "Client config profile group")
	.option("--clientopt [value]", "Redis client options", collectCOpts )


final = ( fnEnd )->
	return ( err, results )->
		if err
			process.stderr.write( err.name + " : " + err.message + "\n" )
		else if _isObject( results )
			process.stdout.write( JSON.stringify( results, 1, 2 ) )
		else if _isString( results )
			process.stdout.write( results )
		else if not results?
			process.stdout.write( "OK" )
		else
			process.stdout.write( results.toString() )
		if fnEnd?
			fnEnd()
		return
commands = [
	command: 'createqueue'
	description: 'create a queue'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.createQueue( final( rsmq.quit ) )
		return
,
	command: 'deletequeue'
	description: 'delete a queue'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.deleteQueue( final( rsmq.quit ) )
		return
,
	command: [ 'listqueues', 'ls' ]
	description: 'list all existing queues'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.listqueues( final( rsmq.quit ) )
		return
,
	command: [ 'send <msgs...>', 'sn <msgs...>' ]
	description: 'send a message'
	action: ( msgs, options )->
		rsmq = RSMQ( options.parent )
		rsmq.send( msgs, final( rsmq.quit ) )
		return
,
	command: ['receive', 'rc']
	description: 'receive a message'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.receive( final( rsmq.quit ) )
		return
,
	command: ['delete <ids...>', 'rm <ids...>']
	description: 'delete one or more messages'
	action: ( ids, options )->
		rsmq = RSMQ( options.parent )
		rsmq.delete( ids, final( rsmq.quit ) )
		return
,
	command: 'stats'
	description: 'get queue stats'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.stats( final( rsmq.quit ) )
		return
,
	command: 'count'
	description: 'get number of messages in the queue'
	action: ( options )->
		rsmq = RSMQ( options.parent )
		rsmq.stats( true, final( rsmq.quit ) )
		return
,
	command: ['visibility <id> <vt>','vs <id> <vt>']
	description: 'list all existing queues'
	action: ( id, vt, options )->
		rsmq = RSMQ( options.parent )
		rsmq.visibility( id, vt, final( rsmq.quit ) )
		return
,
	command: ['attributes <name> <value>', 'attr <name> <value>']
	description: 'list all existing queues'
	action: ( _n, _v, options )->
		rsmq = RSMQ( options.parent )
		rsmq.attributes( _n, _v, final( rsmq.quit ) )
		return
,
	command: 'config <type> [name] [value]'
	description: 'list all existing queues'
	options: [ [ "-j, --json", "Return format as JSON" ] ]
	action: ( type, _n, _v, options )->
		_final = final()
		_asString = ( _cnf )->
			_s = []
			for _k, _v of _cnf
				_s.push _k + ": " + _v
			return _s.join( "\n" )
		_group = options.group or options.parent.group

		if type is "set"
			cnf.setConfig _n, _v, _group, ( err, _cnf )->
				if err
					_final( err )
					return
				if options.json
					_final( null, JSON.stringify( cnf.jsonProcess( _cnf, false ) ) )
					return
				
				_final( null, _asString( _cnf ) )
				return
			return
		if type is "get"
			cnf.getConfig( _n, _group, _final )
			return
		if type is "ls"
			_cnf = cnf.read( _group, false )
			if options.json
				_final( null, JSON.stringify( _cnf ) )
				return
			_final( null, _asString( _cnf ) )
		return
]


for _cmd in commands
	if _isArray( _cmd.command )
		for _c in _cmd.command
			_cl = cli
				.command( _c )
				.description( _cmd.command )
				.action _cmd.action
			if _cmd.options?.length
				for opts in _cmd.options
					_cl.option.apply( _cl, opts )
	else
		_cl = cli
			.command( _cmd.command )
			.description( _cmd.command )
			.action _cmd.action
		if _cmd.options?.length
			for opts in _cmd.options
				_cl.option.apply( _cl, opts )

cli.parse(process.argv)
