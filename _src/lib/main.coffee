# # RsmqCli

# ### extends [NPM:MPBasic](https://cdn.rawgit.com/mpneuried/mpbaisc/master/_docs/index.coffee.html)

#
# ### Exports: *Class*
#
# Main Module
# 

class RsmqCli extends require( "mpbasic" )()

	# ## defaults
	defaults: =>
		@extend super, 
			# **RsmqCli.foo** *Number* This is a example default option
			foo: 23
			# **RsmqCli.bar** *String* This is a example default option
			bar: "Buzz"

	###	
	## constructor 
	###
	constructor: ( options )->
		super
		

		@start()

		return

	start: =>
		@debug "START"
		return

#export this class
module.exports = RsmqCli