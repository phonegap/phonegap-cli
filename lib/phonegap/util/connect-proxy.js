var http = require('http'),
    path = require('path'),
    fs = require('fs');

function _settings(data) {
  var projectRootPath = require('../../cordova').util.isCordova();
  var settings = projectRootPath ? path.join(projectRootPath, ".connectrc") : null;
  return new Promise(
    function(resolve, reject) {
      if (settings && fs.existsSync(settings) && data === undefined) {
        fs.readFile(settings, (err, data) => {
          if(err) throw err;
          resolve(JSON.parse(data));
        });
      } else if(data !== undefined) {
        fs.writeFile(settings, JSON.stringify(data, null, 4), (err) => {
          if(err) throw err;
          resolve(data);
        });
      }
      else {
        resolve(null);
      }
    }
  );
}

module.exports = {

  uploadAppZip: function(options) {
    
    _settings().then(settings => {
      var local_opt = {
        hostname: '127.0.0.1',
        port: options.port || 3000,
        method: 'GET',
        path: '/__api__/appzip'
      };
      var local_req = http.request(local_opt);
      
      var remote_opt = {
        hostname: '127.0.0.1', // FIXME change this to https://connect.phonegap.com
        port: 1234, // FIXME remote this
        method: 'POST',
        path: '/'
      };
      
      var remote_req = http.request(remote_opt);
      
      remote_req.on('response', response => {
        var data = '';
        response.on('data', chunk => {
          data += chunk;
          console.log(`BODY: ${chunk}`);
        });
        response.on('end', chunk => {
          _settings(JSON.parse(data));
        });
      });
      local_req.on('response', function(response) {
        if(settings) {
          remote_req.setHeader('Connect-API-Arg', JSON.stringify(settings));
        }
        response.pipe(remote_req);
      });
      local_req.end();
    });

  },

  uploadUpdatedZip: function(options) {
    var opt = {
      hostname: '127.0.0.1',
      port: options.port || 3000,
      method: 'GET',
      path: '/__api__/update'
    };
    var ws = fs.createWriteStream('/tmp/update.zip');

    var req = http.request(opt);
    req.on('response', function(response) {
      response.pipe(ws); 
    });
    req.end();
  }


}
