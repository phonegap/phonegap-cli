/*
 * Module dependencies.
 */

var qrcode = require('qrcode-terminal'),
    CLI = require('../../lib/cli'),
    cli,
    stdout,
    appData,
    emitterSpy;

/*
 * Specification: phonegap help remote build.
 */

describe('phonegap help remote build', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(cli.phonegap.remote, 'build');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help remote', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+build <platform>.*\n/i);
        });
    });

    describe('$ phonegap remote build', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['remote', 'build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap help remote build', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'remote', 'build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap remote build help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'build', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap remote build --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'build'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap remote build -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'build'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });
});

/*
 * Specification: phonegap remote build.
 */

describe('phonegap remote build <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        emitterSpy = {
            on: function() {
                // spy stub
            }
        };
        appData = {
            id: '1234',
            title: 'My App',
            download: {
                android: '/api/v1/apps/322388/android'
            }
        };
        spyOn(qrcode, 'generate');
        spyOn(process.stdout, 'write');
        spyOn(cli.phonegap.remote, 'build').andReturn(emitterSpy);
    });

    describe('$ phonegap remote build android', function() {
        it('should try to login', function() {
            spyOn(cli.remote, 'login');
            cli.argv({ _: ['remote', 'build', 'android'] });
            expect(cli.remote.login).toHaveBeenCalled();
        });

        describe('successful login', function() {
            beforeEach(function() {
                spyOn(cli.remote, 'login').andCallFake(function(argv, callback) {
                    callback(null, {});
                });
            });

            it('should try to build the project', function() {
                cli.argv({ _: ['remote', 'build', 'android'] });
                expect(cli.phonegap.remote.build).toHaveBeenCalledWith(
                    {
                        api: jasmine.any(Object),
                        platforms: ['android']
                    },
                    jasmine.any(Function)
                );
            });

            describe('successful project build', function() {
                beforeEach(function() {
                    cli.phonegap.remote.build.andCallFake(function(opts, callback) {
                        callback(null, appData);
                        return emitterSpy;
                    });
                });

                it('should call callback without an error', function(done) {
                    cli.argv({ _: ['remote', 'build', 'android'] }, function(e, data) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should call callback with a data object', function(done) {
                    cli.argv({ _: ['remote', 'build', 'android'] }, function(e, data) {
                        expect(data).toEqual(appData);
                        done();
                    });
                });

                it('should generate the QRCode', function(done) {
                    cli.argv({ _: ['remote', 'build', 'android'] }, function(e, data) {
                        expect(qrcode.generate).toHaveBeenCalled();
                        expect(qrcode.generate.mostRecentCall.args[0]).toMatch(
                            'https://build.phonegap.com' + data.download.android
                        );
                        done();
                    });
                });
            });

            describe('failed project build', function() {
                beforeEach(function() {
                    cli.phonegap.remote.build.andCallFake(function(opts, callback) {
                        callback(new Error('Could not connect to PhoneGap Build.'));
                        return emitterSpy;
                    });
                });

                it('should call callback with an error', function(done) {
                    cli.argv({ _: ['remote', 'build', 'android'] }, function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });
            });
        });

        describe('failed login', function() {
            beforeEach(function() {
                spyOn(cli.remote, 'login').andCallFake(function(argv, callback) {
                    callback(new Error('Invalid account'));
                });
            });

            it('should not build the project', function() {
                cli.argv({ _: ['remote', 'build', 'android'] });
                expect(cli.phonegap.remote.build).not.toHaveBeenCalled();
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['remote', 'build', 'android'] }, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
