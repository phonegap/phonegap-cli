var http = require('http');
var https = require('https');
var spawn = require('child_process').spawn;
var opn = require('opn');
var util = require('util');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var homedir = process.env['HOME'];
var Command = require('./util/command');
var projectRootPath = require('../cordova').util.isCordova();
var settings = projectRootPath ? path.join(projectRootPath, ".dropboxrc") : null;


function authenticate() {
  return new Promise(
    
    function(resolve, reject) {
      
      _getToken().then((token) => {
        resolve(token);              
      }).catch(() => {

        const auth_url = "https://www.dropbox.com/oauth2/authorize";

        const PORT = 1234;

        var state = require('./util/hex').randomValueHex(12);
        var redirect_uri = "http://localhost:" + PORT;
        const app_key = "2f1ec7whk04rhuq";

        var params = util.format(`?response_type=token&client_id=%s\
&redirect_uri=%s&\
state=%s`,
app_key, redirect_uri, state);

        var server;
        var browser;
        
        function handleRequest(request, response) {
            if (request.url === "/token" && request.method === "POST") {
                var body = [];
                request.on('data', (chunk) => {
                    body.push(chunk);
                    if (body.length > 1e6) {
                        request.connection.destroy();
                    }
                });
                request.on('end', () => {
                    body = Buffer.concat(body).toString();
                    var params = qs.parse(body);
                    if (params.state !== state) {
                        console.error("Wrong state. CSRF forged");
                        process.exit(69);
                    }
                    // TODO write token and shit to local file
                    if(settings === null) reject(new Error("Settings file not configured"));
                    fs.writeFile(settings, JSON.stringify(params, null, 4), () => {
                        //console.log("Config file written successfully");
                        request.connection.destroy();
                        server.close(function(err) {
                            resolve(params.access_token);
                        });
                    });
                });
                response.end();
            } else {
                response.setHeader('Content-Type', 'text/html');
                response.end(fs.readFileSync(path.join(__dirname, "./util/public/index.html")));
            }
        }
        //console.log(auth_url + params);

        server = http.createServer(handleRequest);

        server.listen(PORT, () => {
          //console.log("Server listening on: http://localhost:%s", PORT);
          console.log("waiting for API authorization...");
          // Dropbox authentication

          opn(auth_url + params, {app: 'firefox', wait: false}).then((browser) => {
            // TODO
          });
        });

      });
    }
  );
}

function _getToken() {
  return new Promise(
    function(resolve, reject) {
        if (settings && fs.existsSync(settings)) {
            resolve(JSON.parse(fs.readFileSync(settings)).access_token);
        }
        reject(new Error("Config file does not exist. Please authenticate"));
    }
  );
}

function getPublicLinkUrl() {
   return new Promise(
    function(resolve, reject) {
      authenticate().then((token) => {
        var options = {
          hostname: 'api.dropboxapi.com',
          port: 443,
          path: '/1/account/info',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token 
          }
        };

        var account = https.request(options, (res) => {
         // console.log(`STATUS: ${res.statusCode}`);
         // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
          var body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            body += chunk;
            //console.log(`BODY: ${chunk}`);
          });
          res.on('end', () => {
            resolve(`https://dl.dropboxusercontent.com/u/${JSON.parse(body).uid}/pgdevapp/`);
          });
        });
        account.end();
      });
    }
  );
}

function upload(filepath) {
    return authenticate().then((token) => {
      var api_args = {
          "path": "/Public/pgdevapp/__api__/appzip",
          "mode": "overwrite",
          "autorename": true,
          "mute": false
      };


      var options = {
          hostname: 'content.dropboxapi.com',
          port: 443,
          path: '/2/files/upload',
          method: 'POST',
          headers: {
              'Content-Type': 'application/octet-stream',
              'Authorization': 'Bearer ' + token,
              'Dropbox-API-Arg': JSON.stringify(api_args)
          }
      };

      var up = https.request(options, (res) => {
          //console.log(`STATUS: ${res.statusCode}`);
          //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
              //console.log(`BODY: ${chunk}`);
          });
          res.on('end', () => {
              getPublicLinkUrl().then((link) => {
                console.log(`your app will is available here ${link}`);
                resolve(link);
              });
          });
      });
      console.log(`uploading archive to Dropbox...`);
      fs.createReadStream(filepath).pipe(up);
    }).catch((e) => {
      console.error(e.message);       
    });
}

function createZipArchive(dir) {
  return new Promise(function(resolve, reject) {
    var archiver = require('archiver');

    var output = fs.createWriteStream('www.zip');
    var archive = archiver('zip');

    output.on('close', function () {
      console.log("archive created successfully");
      resolve('./www.zip');
    });

    archive.on('error', function(err){
      throw err;
    });
    archive.pipe(output);
    archive.directory(dir, 'www');
    archive.finalize();
  });
}

/*
 *
 * PhoneGap Command :shit:
 * 
 */

var ShareDefaults = {};

module.exports = {
    create: function(phonegap) {
        return new ShareCommand(phonegap);
    },
    default_settings: ShareDefaults
};

function ShareCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(ShareCommand, Command);

ShareCommand.prototype.run = function(options, callback) {
  options.phonegap = this.phonegap;
  callback = callback || function() {};

  this.execute(options, callback);

  return this.phonegap;
};

ShareCommand.prototype.execute = function(options, callback) {
  if(options.dropbox === true) {
    createZipArchive(path.join(projectRootPath, 'www')).then((filepath) => {
      upload(filepath).then(() => {
        fs.unlinkSync(filepath);
        callback();
      });
    });
  } else {
    throw new Error("Only Dropbox is supported at this time");
  }
}
