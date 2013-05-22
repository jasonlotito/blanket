var sync = (function() {

  var fs = require('fs');

  return {
    sync: function(name, obj){
      var filename = './' + name + '.json';
      fs.writeFile(filename, JSON.stringify(obj), function(err){
        if(err) throw err;
        console.log(filename + ' file saved');
      });
    },
    get: function(name, def){
      var filename = './' + name + '.json';
//      if (fs.existsSync(filename)){
//        return require(filename);
//      }

      this.sync(name, def);
      return def;
    }
  }

})();

module.exports = sync;
