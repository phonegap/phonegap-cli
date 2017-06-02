function createZipArchive(dir) {
    return new Promise(function(resolve, reject) {
        var archiver = require('archiver');

        var archive = archiver('zip');

        archive.on('error', function(err) {
            reject(err);
            throw err;
        });
        archive.directory(dir, 'www');
        resolve(archive);
    });
}

module.exports = {
    createZipArchive: createZipArchive
};
