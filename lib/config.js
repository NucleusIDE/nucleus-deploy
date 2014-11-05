var cjson = require('cjson');
var path = require('path');
var fs = require('fs');
var config = require('./config');


module.exports = {
  read: function() {
    var nucJsonPath = path.resolve('nucleus.json');

    if(fs.existsSync(nucJsonPath)) {
      var config = cjson.load(nucJsonPath);

      config.env = config.env || {};

      if(typeof config.setupNode === "undefined") {
        config.setupNode = true;
      }

      if(typeof config.appName === "undefined") {
        config.appName = "nucleus";
      }

      return config;
    } else {
      console.error('nucleus.json file does not exist!');
      process.exit(1);
    };
  }
};
