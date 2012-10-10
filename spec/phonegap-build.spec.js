describe('phonegap-build', function() {
    var build = require('../lib/phonegap-build');

    describe('create', function() {
        it('should exist', function() {
            expect(build.create).toBeDefined();
        });
    });

    describe('user', function() {
        describe('login', function() {
            it('should exist', function() {
                expect(build.user.login).toBeDefined();
            });
        });

        describe('logout', function() {
            it('should exist', function() {
                expect(build.user.logout).toBeDefined();
            });
        });
    });

    describe('app', function() {
        describe('create', function() {
            it('should exist', function() {
                expect(build.app.create).toBeDefined();
            });
        });

        describe('destroy', function() {
            it('should exist', function() {
                expect(build.app.destroy).toBeDefined();
            });
        });

        describe('list', function() {
            it('should exist', function() {
                expect(build.app.list).toBeDefined();
            });
        });

        describe('info', function() {
            it('should exist', function() {
                expect(build.app.info).toBeDefined();
            });
        });
    });

    describe('platform', function() {
        describe('add', function() {
            it('should exist', function() {
                expect(build.platform.add).toBeDefined();
            });
        });

        describe('remove', function() {
            it('should exist', function() {
                expect(build.platform.remove).toBeDefined();
            });
        });

        describe('list', function() {
            it('should exist', function() {
                expect(build.platform.list).toBeDefined();
            });
        });
    });
});
