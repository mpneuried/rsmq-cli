path = require('path')
exec = require('child_process').exec
should = require('should')

_isString = require( "lodash/isString" )
_isNumber = require( "lodash/isNumber" )
_isObject = require( "lodash/isObject" )

utils = require( "../lib/utils" )
Module = require( "../." )

# define a random queue-name
qname = utils.randomString( 10, 1 )

call = ( args..., cb )->
	cmds = []
	opts = {}
	for ag in args
		if _isString( ag ) or _isNumber( ag )
			cmds.push ag
		else if _isObject( ag )
			opts = ag

	if process.env[ "global" ]?
		_path = [ "rsmq" ]
	else
		_path = [ path.resolve( __dirname, "../bin/rsmq.js" ) ]
		
	_path = _path.concat( cmds )
	for _k, _v of opts
		if _k.length is 1
			_path.push( "-#{_k}" )
		else
			_path.push( "--#{_k}" )
		if _v?
			_path.push _v

	#console.log "CMD: ", _path.join( " " )
	exec _path.join( " " ), (err, stdout, stderr)->
		if err
			cb( err )
			return

		if stderr?.length
			cb( stderr )
			return

		cb( null, stdout )
		return
	return

describe "----- rsmq-cli TESTS -----", ->

	before ( done )->
		# TODO add initialisation Code
		done()
		return

	after ( done )->
		#  TODO teardown
		done()
		return

	describe 'Default Tests', ->
		_ids = []
		# Implement tests cases here
		it "create queue", ( done )->
			call "create", { "q": qname }, ( err, result )->
				throw err if err
				should.exist( result )
				result.should.equal( "1" )
				done()
				return
			return

		it "create queue a second time", ( done )->
			call "create", { "q": qname }, ( err, result )->
				should.exist( err )
				err.should.containEql( "queueExists" )
				done()
				return
			return

		it "send one message", ( done )->
			call "send", { "q": qname }, "abc", ( err, result )->
				throw err if err
				ids = result.split( "\n" )
				ids.should.have.length( 1 )
				_ids.push( ids[0] )
				done()
				return
			return

		it "send a message to a not existing queue", ( done )->
			call "send", { "q": qname + "_false" }, "abc", ( err, result )->
				should.exist( err )
				err.should.containEql( "queueNotFound" )
				done()
				return
			return

		it "send a message to a wrong namespace", ( done )->
			call "send", { "q": qname + "_false", ns: "abc" }, "abc", ( err, result )->
				should.exist( err )
				err.should.containEql( "queueNotFound" )
				done()
				return
			return

		it "send multiple messages", ( done )->
			call "sn", { "q": qname }, "xyz1","xyz2","xyz3", ( err, result )->
				throw err if err
				ids = result.split( "\n" )
				ids.should.have.length( 3 )
				_ids = _ids.concat( ids )
				done()
				return
			return

		it "receive a messages", ( done )->
			call "receive", { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.rc.should.eql( 1 )
				_data.message.should.eql( "abc" )
				done()
				return
			return

		it "receive another messages", ( done )->
			call "rc", { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.rc.should.eql( 1 )
				_data.message.should.eql( "xyz1" )
				done()
				return
			return

		it "get queue count", ( done )->
			call "count", { "q": qname }, ( err, result )->
				throw err if err
				should.exist( result )
				result.should.equal( "4" )
				done()
				return
			return

		it "delete a message", ( done )->
			call "delete", _ids[0],{ "q": qname }, ( err, result )->
				throw err if err
				ids = result.split( "\n" )
				ids.should.have.length( 1 )
				ids[0].should.eql( "1" )
				done()
				return
			return

		it "get queue count", ( done )->
			call "count", { "q": qname }, ( err, result )->
				throw err if err
				should.exist( result )
				result.should.equal( "3" )
				done()
				return
			return

		it "delete multiple messages", ( done )->
			call "rm", _ids[1], _ids[2],{ "q": qname }, ( err, result )->
				throw err if err
				ids = result.split( "\n" )
				ids.should.have.length( 2 )
				ids[0].should.eql( "1" )
				ids[1].should.eql( "1" )
				done()
				return
			return

		it "get queue count", ( done )->
			call "count", { "q": qname }, ( err, result )->
				throw err if err
				should.exist( result )
				result.should.equal( "1" )
				done()
				return
			return

		it "get the queue stats", ( done )->
			call "stats", { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 0 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "set queue attribute `vt`", ( done )->
			call "attributes", "vt", 120, { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 0 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "get the queue stats", ( done )->
			call "stats", { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 0 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "set queue attribute `delay`", ( done )->
			call "attributes", "delay", 5, { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.delay.should.equal( 5 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 0 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "set queue attribute `maxsize`", ( done )->
			call "attributes", "maxsize", 1024, { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.delay.should.equal( 5 )
				_data.maxsize.should.equal( 1024 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 0 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "get the queue stats again", ( done )->
			call "stats", { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.delay.should.equal( 5 )
				_data.maxsize.should.equal( 1024 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 0 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "list queues", ( done )->
			call "ls", ( err, queues )->
				throw err if err
				_data = queues.split( "\n" )
				if qname not in _data
					throw new Error( "missing queuename" )
				done()
				return
			return

		it "change a message visibility", ( done )->
			call "vs", _ids[3], 3, { "q": qname }, ( err, result )->
				throw err if err
				result.should.eql("1")
				done()
				return
			return

		it "try to receive the messages", ( done )->
			call "rc", { "q": qname }, ( err, result )->
				result.should.eql("{}")
				done()
				return
			return

		it "get the queue stats to check hidden msg", ( done )->
			call "stats", { "q": qname }, ( err, result )->
				throw err if err
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.delay.should.equal( 5 )
				_data.maxsize.should.equal( 1024 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 1 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "try to receive the messages after timeout (`vt`)", ( done )->
			@timeout(5000)
			setTimeout( ->
				call "rc", { "q": qname }, ( err, result )->
					throw err if err
					_data = JSON.parse( result )
					_data.rc.should.eql( 1 )
					_data.message.should.eql( "xyz3" )
					done()
					return
				return
			, 3000 )
			return
		return

	describe 'Config Tests', ->
		_conf = null

		_group = utils.randomString( 10, 0 )
		_ns = utils.randomString( 5, 0 )

		it "get the current config", ( done )->
			call "config", "ls", ( err, result )->
				throw err if err
				result.should.containEql( "port:" )
				result.should.containEql( "host:" )
				result.should.containEql( "ns:" )
				result.should.containEql( "timeout:" )
				done()
				return
			return

		it "get the current config as json", ( done )->
			call "config", "ls", { "json": null }, ( err, result )->
				throw err if err
				_conf = JSON.parse( result )
				_conf.port.should.be.type('number')
				_conf.host.should.be.type('string')
				_conf.ns.should.be.type('string')
				_conf.timeout.should.be.type('number')
				done()
				return
			return

		it "get another config group as json", ( done )->
			call "config", "ls", { "json": null, "g": _group }, ( err, result )->
				throw err if err
				_conf = JSON.parse( result )
				_conf.port.should.be.type('number')
				_conf.host.should.be.type('string')
				_conf.ns.should.be.type('string')
				should.not.exist( _conf.qname )
				_conf.timeout.should.be.type('number')
				done()
				return
			return

		it "try to get the size of a not existing queue of group", ( done )->
			call "count", { "g": _group }, ( err, result )->
				should.exist( err )
				err.should.containEql( "EMISSINGQNAME" )
				done()
				return
			return

		it "set the ns for the current config", ( done )->
			call "config", "set", "ns", _ns, { "json": null, g: _group }, ( err, result )->
				throw err if err
				_conf = JSON.parse( result )
				_conf.port.should.be.type('number')
				_conf.host.should.be.type('string')
				_conf.ns.should.be.type('string')
				_conf.ns.should.equal( _ns )
				_conf.timeout.should.be.type('number')
				done()
				return
			return

		it "create a new queue", ( done )->
			call "create", { "q": qname, "g": _group }, ( err, result )->
				throw err if err
				should.exist( result )
				result.should.equal( "1" )
				done()
				return
			return

		it "set the qname for the  current config", ( done )->
			call "config", "set", "qname", qname, { "json": null, "g": _group }, ( err, result )->
				throw err if err
				_conf = JSON.parse( result )
				_conf.port.should.be.type('number')
				_conf.host.should.be.type('string')
				_conf.ns.should.be.type('string')
				_conf.qname.should.be.type('string')
				_conf.qname.should.equal( qname )
				_conf.timeout.should.be.type('number')
				done()
				return
			return

		it "get the queue count of group without defineing the qname", ( done )->
			call "count", { "g": _group }, ( err, result )->
				throw err if err
				should.exist( result )
				result.should.equal( "0" )
				done()
				return
			return

		it "set the global qname", ( done )->
			call "config", "set", "qname", qname, { "json": null }, ( err, result )->
				throw err if err
				_conf = JSON.parse( result )
				_conf.port.should.be.type('number')
				_conf.host.should.be.type('string')
				_conf.ns.should.be.type('string')
				_conf.qname.should.be.type('string')
				_conf.qname.should.equal( qname )
				_conf.timeout.should.be.type('number')
				done()
				return
			return
		
		it "get the queue count without the qname", ( done )->
			call "count", ( err, result )->
				throw err if err
				should.exist( result )
				result.should.equal( "1" )
				done()
				return
			return

		it "reset global qname", ( done )->
			call "config", "set", "qname", { "json": null }, ( err, result )->
				throw err if err
				_conf = JSON.parse( result )
				_conf.port.should.be.type('number')
				_conf.host.should.be.type('string')
				_conf.ns.should.be.type('string')
				_conf.timeout.should.be.type('number')
				should.not.exist( _conf.qname )
				done()
				return
			return

		it "reset global ns", ( done )->
			call "config", "set", "ns", { "json": null }, ( err, result )->
				throw err if err
				_conf = JSON.parse( result )
				_conf.port.should.be.type('number')
				_conf.host.should.be.type('string')
				_conf.timeout.should.be.type('number')
				_conf.ns.should.be.type('string')
				_conf.ns.should.equal( "rsmq" )
				done()
				return
			return
		return
	
	describe 'Error Tests', ->
		it "invalid create call", ( done )->
			call "create", "abc", ( err, result )->
				should.exist( err )
				err.should.startWith( "EMISSINGQNAME" )
				done()
				return
			return
		return
	return
