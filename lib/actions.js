var fs = require("fs"),
    path = require("path"),
    Config = require("./config"),
    nodemiral = require("nodemiral");

var SCRIPT_DIR = path.resolve(__dirname, '../scripts/');


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
    var config = Config.read(),
        session = this.getNodemiralSession(),
        taskList = nodemiral.taskList('Setup');

    if (!! config.setupNode) {
      taskList.executeScript('Installing Node.js', {
        script: path.resolve(SCRIPT_DIR, 'install_node.sh'),
        vars: {
          nodeVersion: config.nodeVersion
        }
      });
    }

    taskList.execute("Cloning app to ~/.nucleus/"+config.appName, {
      command: "git clone " + config.git.url + " ~/.nucleus/"+config.appName
    }, function(stdout, stderr) {
      console.log("STDOUT:", stdout);
    });

    taskList.run(session);
  },

  deploy: function() {

  }
};

module.exports = Actions;
