module.exports = ( rsmq )->
	final: ( err, results )=>
		if err
			process.stderr.write( err.name + " : " + err.message )
		else
			process.stdout.write( results.toString() )
		process.stdout.write( "\n" )
		rsmq.quit()
		return
