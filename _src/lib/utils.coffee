module.exports =
	randRange: ( lowVal, highVal )->
		if _.isArray( lowVal )
			Math.floor( Math.random()*(lowVal[ 1 ]-lowVal[ 0 ]+1 ))+lowVal[ 0 ]
		else
			Math.floor( Math.random()*(highVal-lowVal+1 ))+lowVal
		
	randomString: ( string_length = 5, specialLevel = 0 ) ->
		chars = "BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz"
		chars += "0123456789" if specialLevel >= 1
		chars += "_-@:." if specialLevel >= 2
		chars += "!\"§$%&/()=?*'_:;,.-#+¬”#£ﬁ^\\˜·¯˙˚«∑€®†Ω¨⁄øπ•‘æœ@∆ºª©ƒ∂‚å–…∞µ~∫√ç≈¥" if specialLevel >= 3

		randomstring = ""
		i = 0
		
		while i < string_length
			rnum = Math.floor(Math.random() * chars.length)
			randomstring += chars.substring(rnum, rnum + 1)
			i++
		randomstring

	trim: ( str )->
		return str.replace(/^\s+|\s+$/g, '')