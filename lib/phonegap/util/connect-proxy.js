var http = require('http'),
    path = require('path'),
    fs = require('fs');
    local_opt = {
        hostname: '127.0.0.1',
        method: "GET"
    },
    remote_opt = {
        hostname: 'connect.phonegap.com',
        port: 80
        //hostname: '127.0.0.1',
        //port: 1234
    };
      


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
      local_opt.path = "/__api__/appzip";
      local_opt.port = options.port || 3000;

      remote_opt.method = "POST";
      remote_opt.path = "/";

      var local_req = http.request(local_opt),
          remote_req = http.request(remote_opt);
        
      if(settings) {
        remote_req.setHeader('Connect-API-Arg', JSON.stringify(settings));
      }

      
      remote_req.on('response', response => {
        var data = '';
        response.on('data', chunk => {
          data += chunk;
        });
        response.on('end', chunk => {
          if(response.statusCode === 200) {
            settings = JSON.parse(data);
            _settings(settings);
            if(settings.uploaded === true) {
              console.log(`Updating your app with ID ${settings.id}`);
            }
            local_req.setHeader('Host', `${remote_opt.hostname}:${remote_opt.port}/${settings.id}`);
            local_req.end();
          } else {
            console.error('an error occurred', data);
          }
        });
      });
      local_req.on('response', (response) => {
        remote_req = http.request(remote_opt);
        if(!settings) {
          throw new Error("No settings set. An error occurred");
        }
        remote_req.setHeader('Connect-API-Arg', JSON.stringify(settings));
        remote_req.on('response', (response) => {
          var data = '';
          response.on('data', chunk => {
            data += chunk;
          });
          response.on('end', () => {
            var result = JSON.parse(data);
            if(response.statusCode === 200 && result && result.uploaded === true) {
              console.log(`Your app is available at http://${remote_opt.hostname}:${remote_opt.port}/${settings.id}`);
            }
          });
        });
        response.pipe(remote_req);
      });
      remote_req.end();
    });

  },

  uploadUpdatedZip: function(options) {
    _settings().then(settings => {
      if(!settings) throw new Error('Settings file could not be found!');
      local_opt.path = "/__api__/update";
      local_opt.port = options.port || 3000;
      remote_opt.method = "PUT";
      remote_opt.path = `/${settings.id}`;

      var local_req = http.request(local_opt);
      
      local_req.setHeader('Host', `${remote_opt.hostname}:${remote_opt.port}/${settings.id}`);

      local_req.on('response', function(response) {
        var remote_req = http.request(remote_opt);
        remote_req.on('response', response => {
          var data = '';
          response.on('data', chunk => {
            data += chunk;
          });
          response.on('end', chunk => {
            settings = JSON.parse(data);
            _settings(settings);
            console.log(`Your app has been updated at http://${remote_opt.hostname}:${remote_opt.port}/${settings.id}`);
          });
        });
        if(response.statusCode === 200) {
          remote_req.setHeader('Connect-API-Arg', JSON.stringify(settings));
          response.pipe(remote_req);
        }
      });
      local_req.end();
    });
  }


}
