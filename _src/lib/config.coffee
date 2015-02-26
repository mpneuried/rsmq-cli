cli = require( "./_global_opt" )
RSMQueue = require( "./_rsmq" )

cli
	.parse(process.argv)

rsmq = RSMQueue( cli )

console.log cli
