(function() {
  var _config, _home, err, fs, pathToGlobalConf;

  fs = require("fs");

  _home = process.env["HOME"] || process.env["HOMEPATH"] || process.env["USERPROFILE"];

  pathToGlobalConf = _home + "/.rsmq";

  try {
    _config = fs.readFileSync(pathToGlobalConf);
  } catch (_error) {
    err = _error;
    console.log(err);
    if (err.message.indexOf("ENOENT") === 0) {
      console.log("DEBUG - create global config");
      fs.writeFileSync(pathToGlobalConf, "");
      _config = "";
    }
  }

  module.exports = {};

}).call(this);
