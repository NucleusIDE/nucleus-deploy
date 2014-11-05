var fs = require("fs"),
    path = require("path");

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
  }
};

module.exports = Actions;
