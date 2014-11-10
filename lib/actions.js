var fs = require("fs"),
    path = require("path"),
    Config = require("./config"),
    nodemiral = require("nodemiral");

var Actions = {
  init: function() {
    var destNucJson = path.resolve('nucleus.json');

    if(fs.existsSync(destNucJson)) {
      console.error('A Project Already Exists');
      process.exit(1);
    }

    var sampleNucJson = path.resolve(__dirname, '../sample/nucleus.json');

    copyFile(sampleNucJson, destNucJson);

    console.log('Empty Project Initialized!');

    function copyFile(src, dest) {
      var content = fs.readFileSync(src, 'utf8');
      fs.writeFileSync(dest, content);
    }
  },

  getNodemiralSession: function() {
    var config = Config.read(),
        server = config.servers[0];

    var options = {
      ssh: {'StrictHostKeyChecking': 'no', 'UserKnownHostsFile': '/dev/null'}
    };

    var host = server.host;
    var auth = {username: server.username};

    if(server.pem) {
      auth.pem = fs.readFileSync(path.resolve(server.pem), 'utf8');
    } else {
      auth.password = server.password;
    }

    var session = nodemiral.session(host, auth, options);
    return session;
  },

  setup: function() {
    var session = this.getNodemiralSession();

    console.log("INSTALLING NODE");

    console.log("INSTALLING METEOR");


  }
};

module.exports = Actions;
