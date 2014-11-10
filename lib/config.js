var cjson = require('cjson');
var path = require('path');
var fs = require('fs');
var config = require('./config');


module.exports = {
  read: function() {
    var nucJsonPath = path.resolve('nucleus.json');

    if(fs.existsSync(nucJsonPath)) {
      var config = cjson.load(nucJsonPath);

      //validating servers
      if(!config.servers || config.servers.length == 0) {
        logErrorAndExit('Server information does not exist');
      } else {
        config.servers.forEach(function(server) {
          if(!server.host) {
            logErrorAndExit('Server host does not exist');
          } else if(!server.username) {
            logErrorAndExit('Server username does not exist');
          } else if(!server.password && !server.pem) {
            logErrorAndExit('Server password or pem does not exist');
          } else if(!config.app) {
            logErrorAndExit('Path to app does not exist');
          }

          if(server.pem) {
            server.pem = rewriteHome(server.pem);
          } else {
            // logErrorAndExit('Passwords not supported. Please provide .pem file');
            config._passwordExists = true;
          }
        });
      }


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

function rewriteHome(location) {
  return location.replace('~', process.env.HOME);
}

function logErrorAndExit(message) {
  var errorMessage = 'Invalid nucleus.json file: ' + message;
  console.error(errorMessage);
  process.exit(1);
}
