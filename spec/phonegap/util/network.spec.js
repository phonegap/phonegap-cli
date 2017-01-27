/*!
 * Module dependencies.
 */

var network = require('../../../lib/phonegap/util/network'),
    dns = require('dns');

/*!
 * Specification: Network Connectivity.
 */

describe('network', function() {
    describe('.isOnline(callback)', function() {
        beforeEach(function() {
            spyOn(dns, 'lookup');
        });

        describe('when online', function() {
            beforeEach(function() {
                dns.lookup.andCallFake(function(host, callback) {
                    callback(null);
                });
            });

            it('should return true', function(done) {
                network.isOnline(function(online) {
                    expect(online).toEqual(true);
                    done();
                });
            });
        });

        describe('when offline', function() {
            beforeEach(function() {
                dns.lookup.andCallFake(function(host, callback) {
                    var e = new Error('getaddrinfo ENOTFOUND google.com');
                    e.code = 'ENOTFOUND';
                    callback(e);
                });
            });

            it('should return false', function(done) {
                network.isOnline(function(online) {
                    expect(online).toEqual(false);
                    done();
                });
            });
        });
    });
});
