
// Add the toExist matcher.
beforeEach(function () {
    jasmine.addMatchers({
        'toExist': function () {
            return {
                compare: function (testPath) {

                    var result = {};
                    result.pass = fs.existsSync(testPath);

                    if(result.pass) {
                        result.message = 'Expected file ' + testPath + ' to exist.';
                    } else {
                        result.message = 'Expected file ' + testPath + ' to not exist.';
                    }

                    return result

                }
            }
        }
    });
});