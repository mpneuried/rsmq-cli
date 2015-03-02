fs = require("fs")

_home = process.env[ "HOME" ] or process.env[ "HOMEPATH" ] or process.env[ "USERPROFILE" ]
pathToGlobalConf = "#{_home}/.rsmq" 

try
	_config = fs.readFileSync( pathToGlobalConf )
catch err
	if err.message.indexOf( "ENOENT" ) is 0
		console.log "DEBUG - create global config"
		# create config file
		fs.writeFileSync( pathToGlobalConf, "" )
		_config = ""

module.exports = {}