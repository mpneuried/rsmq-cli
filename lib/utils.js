(function() {
  module.exports = {
    randRange: function(lowVal, highVal) {
      if (_.isArray(lowVal)) {
        return Math.floor(Math.random() * (lowVal[1] - lowVal[0] + 1)) + lowVal[0];
      } else {
        return Math.floor(Math.random() * (highVal - lowVal + 1)) + lowVal;
      }
    },
    randomString: function(string_length, specialLevel) {
      var chars, i, randomstring, rnum;
      if (string_length == null) {
        string_length = 5;
      }
      if (specialLevel == null) {
        specialLevel = 0;
      }
      chars = "BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz";
      if (specialLevel >= 1) {
        chars += "0123456789";
      }
      if (specialLevel >= 2) {
        chars += "_-@:.";
      }
      if (specialLevel >= 3) {
        chars += "!\"§$%&/()=?*'_:;,.-#+¬”#£ﬁ^\\˜·¯˙˚«∑€®†Ω¨⁄øπ•‘æœ@∆ºª©ƒ∂‚å–…∞µ~∫√ç≈¥";
      }
      randomstring = "";
      i = 0;
      while (i < string_length) {
        rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
        i++;
      }
      return randomstring;
    },
    trim: function(str) {
      return str.replace(/^\s+|\s+$/g, '');
    }
  };

}).call(this);
