cli = require( "./_global_opt" )( true )

cli
	.usage('delete <ids...> [options]')
	.parse(process.argv)

rsmq = require( "./_rsmq" )( cli )

processUtil = require( "./_process" )( rsmq )

rsmq.delete( cli.args, processUtil.final )