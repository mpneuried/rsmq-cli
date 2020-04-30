# # RSMQCli

# ### extends [NPM:MPBasic](https://cdn.rawgit.com/mpneuried/mpbaisc/master/_docs/index.coffee.html)

#
# ### Exports: *Class*
#
# Main Module
# 
async = require( "async" )
cnf = require( "./_global_conf" )

RSMQueue = require( "rsmq" )

#export this class

_attributeNames = [ "vt", "delay", "maxsize" ]

class RSMQCli extends require( "mpbasic" )()

	# ## defaults
	defaults: =>
		return @extend super,
			# **RSMQCli.port** *Number* Redis port
			port: 6379
			# **RSMQCli.host** *String* Redis host
			host: "127.0.0.1"
			# **RSMQCli.ns** *String* RSMQ namespace
			ns: "rsmq"
			# **RSMQCli.clientopt** *Object* RSMQ connection options
			clientopt: {}
			# **RSMQCli.qname** *String* RSMQ namespace
			qname: null
			# **RSMQCli.timeout** *Number* timeout to wait for a redis connection
			timeout: 3000

	###	
	## constructor 
	###
	constructor: ( options )->
		if options?.group?.length
			_cnf = cnf.read( options.group, false )
		else
			_cnf = cnf.read( null, false )
		
		super( @extend( {}, _cnf, options ) )
		@ready = false

		@send = @_waitUntil( @_send )
		@receive = @_waitUntil( @_receive )
		@delete = @_waitUntil( @_delete )
		@createQueue = @_waitUntil( @_createQueue )
		@deleteQueue = @_waitUntil( @_deleteQueue )
		@stats = @_waitUntil( @_stats )
		@listqueues = @_waitUntil( @_listqueues )
		@visibility = @_waitUntil( @_visibility )
		@attributes = @_waitUntil( @_attributes )

		@rsmq = new RSMQueue
			port: @config.port
			host: @config.host
			ns: @config.ns
			options: @config.clientopt
			

		@ready = @rsmq.connected
		@rsmq.on "connect", =>
			clearTimeout( @wait4Connection ) if @wait4Connection?
			@ready = true
			@emit( "ready" )
			return

		@rsmq.on "disconnect", =>
			@ready = false
			@emit( "disconnect" )
			return

		if not @ready
			@wait4Connection = setTimeout( =>
				@final( @_handleError( true, "ECONNECTIONTIMEOUT" ) )
				process.exit( 1 )
				return
			, @config.timeout )

		return

	_send: ( messages, cb )=>
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return

		afns = []
		for msg in messages
			afns.push @_sendSingle( msg )

		async.parallel afns, ( err, result )->
			if err
				cb( err )
				return

			cb( null, result.join( "\n" ) )
			return
		return

	_sendSingle: ( msg )=>
		return ( cb )=>
			@rsmq.sendMessage( { qname: @config.qname, message: msg }, cb )
			return

	_createQueue: ( cb )=>
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return
			
		_args =
			qname: @config.qname
			vt: @config.vt or 30
			delay: @config.delay or 0
			maxsize: @config.maxsize or 65536

		@rsmq.createQueue _args, ( err, result )->
			if err
				process.stdout.write( JSON.stringify( _args, 1, 2 ) )
				cb( err )
				return
			cb( null, result )
			return
		return

	_deleteQueue: ( cb )=>
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return
			
		_args =
			qname: @config.qname

		@rsmq.deleteQueue _args, ( err, result )->
			if err
				process.stdout.write( JSON.stringify( _args ) )
				cb( err )
				return
			cb( null, result )
			return
		return

	_listqueues: ( cb )=>
		@rsmq.listQueues ( err, queues )->
			if err
				cb( err )
				return
			cb( null, queues.join( "\n" ) )
			return
		return

	_visibility: ( msgid, vt, cb )=>
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return

		if not msgid?.length
			@_handleError( cb, "EINVALIDMSGID" )
			return

		if not vt? or isNaN( parseInt( vt, 10 ) )
			@_handleError( cb, "EINVALIDVT" )
			return

		_args =
			qname: @config.qname
			vt: parseInt( vt, 10 )
			id: msgid

		@rsmq.changeMessageVisibility( _args, cb )
		return

	_attributes: ( _name, _value, cb )=>
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return

		if not _name?.length or _name not in _attributeNames
			@_handleError( cb, "EINVALIDATTRNAME" )
			return

		if not _value? or isNaN( parseInt( _value, 10 ) )
			@_handleError( cb, "EINVALIDVT" )
			return

		_args =
			qname: @config.qname

		_args[ _name ] = parseInt( _value, 10 )

		@rsmq.setQueueAttributes _args, ( err, stats )->
			if err
				cb( err )
				return
			cb( null, JSON.stringify( stats ) )
			return
		return

	_stats: ( args..., cb )=>
		[ onlycount ] = args
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return

		_args =
			qname: @config.qname

		@rsmq.getQueueAttributes _args, ( err, stats )->
			if err
				cb( err )
				return
			if onlycount
				cb( null, stats.msgs )
				return
			cb( null, JSON.stringify( stats ) )
			return
		return

	_delete: ( ids, cb )=>
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return
			
		if not ids?.length
			@_handleError( cb, "EINVALIDMSGIDS" )
			return

		afns = []
		for id in ids
			afns.push @_deleteSingle( id )

		async.parallel afns, ( err, result )->
			if err
				cb( err )
				return

			cb( null, result.join( "\n" ) )
			return
		return

	_deleteSingle: ( id )=>
		return ( cb )=>
			_args =
				qname: @config.qname
				id: id
			
			@rsmq.deleteMessage( _args, cb )
			return

	_receive: ( cb )=>
		if not @config.qname?.length
			@_handleError( cb, "EMISSINGQNAME" )
			return

		_args =
			qname: @config.qname
		@rsmq.receiveMessage _args, ( err, message )->
			if err
				cb( err )
				return
			cb( null, JSON.stringify( message ) )
			return
		return

	quit: =>
		clearTimeout( @wait4Connection ) if @wait4Connection?
		process.nextTick =>
			@rsmq.redis.quit()
			return
		return

	ERRORS: =>
		return @extend super,
			"ECONNECTIONTIMEOUT": [ 400, "Cannot connect to redis" ]
			"EMISSINGQNAME": [ 400, "missing --qname` or `-q` argument" ]
			"EINVALIDMSGID": [ 400, "invalid message id. Please define a message id" ]
			"EINVALIDMSGIDS": [ 400, "invalid message id's. Please define at least one message id" ]
			"EINVALIDVT": [ 400, "invalid message vt. Please define a numeric visibility time" ]
			"EINVALIDATTRNAME": [ 400, "invalid attribute name. Only `#{_attributeNames.join( "`, `" )}` are allowed." ]


module.exports = ( cli )->
	return new RSMQCli( cli )
