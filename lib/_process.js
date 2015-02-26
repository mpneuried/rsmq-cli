(function() {
  module.exports = function(rsmq) {
    return {
      final: (function(_this) {
        return function(err, results) {
          if (err) {
            process.stderr.write(err.name + " : " + err.message);
          } else {
            process.stdout.write(results.toString());
          }
          process.stdout.write("\n");
          rsmq.quit();
        };
      })(this)
    };
  };

}).call(this);
