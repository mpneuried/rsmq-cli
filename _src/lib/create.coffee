cli = require( "./_global_opt" )( true )

cli
	.usage('create [options] <qname>')
	.parse(process.argv)

rsmq = require( "./_rsmq" )( cli )
processUtil = require( "./_process" )( rsmq )

rsmq.create( processUtil.final )