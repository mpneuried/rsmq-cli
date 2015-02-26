cli = require( "./_global_opt" )( true )

cli
	.usage('visibility [options] <qname>')
	.parse(process.argv)

rsmq = require( "./_rsmq" )( cli )
processUtil = require( "./_process" )( rsmq )

rsmq.visibility( cli.args[0], cli.args[1], processUtil.final )