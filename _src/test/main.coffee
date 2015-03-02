path = require('path')
exec = require('child_process').exec
should = require('should')
_ = require( "lodash" )

utils = require( "../lib/utils" )
Module = require( "../." ) 

# define a random queue-name
qname = utils.randomString( 10, 1 )

call = ( args..., cb )->
	cmds = []
	opts = {}
	for ag in args
		if _.isString( ag ) or _.isNumber( ag )
			cmds.push ag
		else if _.isObject( ag )
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
				should.not.exist( err )
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
				should.not.exist( err )
				ids = result.split( "\n" )
				ids.should.have.length( 1 )
				_ids.push( ids[0] )
				done()
				return
			return

		it "send multiple messages", ( done )->
			call "sn", { "q": qname }, "xyz1","xyz2","xyz3", ( err, result )->
				should.not.exist( err )
				ids = result.split( "\n" )
				ids.should.have.length( 3 )
				_ids = _ids.concat( ids )
				done()
				return
			return

		it "receive a messages", ( done )->
			call "receive", { "q": qname }, ( err, result )->
				should.not.exist( err )
				_data = JSON.parse( result )
				_data.rc.should.eql( 1 )
				_data.message.should.eql( "abc" )
				done()
				return
			return

		it "receive another messages", ( done )->
			call "rc", { "q": qname }, ( err, result )->
				should.not.exist( err )
				_data = JSON.parse( result )
				_data.rc.should.eql( 1 )
				_data.message.should.eql( "xyz1" )
				done()
				return
			return

		it "get queue count", ( done )->
			call "count", { "q": qname }, ( err, result )->
				should.not.exist( err )
				should.exist( result )
				result.should.equal( "4" )
				done()
				return
			return

		it "delete a message", ( done )->
			call "delete", _ids[0],{ "q": qname }, ( err, result )->
				should.not.exist( err )
				ids = result.split( "\n" )
				ids.should.have.length( 1 )
				ids[0].should.eql( "1" )
				done()
				return
			return

		it "get queue count", ( done )->
			call "count", { "q": qname }, ( err, result )->
				should.not.exist( err )
				should.exist( result )
				result.should.equal( "3" )
				done()
				return
			return

		it "delete multiple messages", ( done )->
			call "rm", _ids[1], _ids[2],{ "q": qname }, ( err, result )->
				should.not.exist( err )
				ids = result.split( "\n" )
				ids.should.have.length( 2 )
				ids[0].should.eql( "1" )
				ids[1].should.eql( "1" )
				done()
				return
			return

		it "get queue count", ( done )->
			call "count", { "q": qname }, ( err, result )->
				should.not.exist( err )
				should.exist( result )
				result.should.equal( "1" )
				done()
				return
			return

		it "get the queue stats", ( done )->
			call "stats", { "q": qname }, ( err, result )->
				should.not.exist( err )
				_data = JSON.parse( result )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 1 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "set queue attribute `vt`", ( done )->
			call "attributes", "vt", 120, { "q": qname }, ( err, result )->
				should.not.exist( err )
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 1 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "get the queue stats", ( done )->
			call "stats", { "q": qname }, ( err, result )->
				should.not.exist( err )
				_data = JSON.parse( result )
				_data.vt.should.equal( 120 )
				_data.msgs.should.equal( 1 )
				_data.hiddenmsgs.should.equal( 1 )
				_data.totalrecv.should.equal( 2 )
				_data.totalsent.should.equal( 4 )
				done()
				return
			return

		it "list queues", ( done )->
			call "ls", ( err, queues )->
				should.not.exist( err )
				_data = queues.split( "\n" )
				if qname not in _data
					throw "missing queuename"
				done()
				return
			return

		return
	return