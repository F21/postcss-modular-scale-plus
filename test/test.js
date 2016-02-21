'use strict';

var postcss = require('postcss'),
    expect = require('chai').expect,
    fs = require('fs'),
    path = require('path'),
    plugin = require('../'),
    calc = require('postcss-calc');

var test = function (fixture, opts, done) {
    var input = fixture + '.css',
        expected = fixture + '.expected.css';

    input = fs.readFileSync(path.join(__dirname, 'fixtures', input), 'utf8');
    expected = fs.readFileSync(path.join(__dirname, 'fixtures', expected), 'utf8');

    postcss([calc, plugin(opts)])
        .process(input)
        .then(function (result) {
            expect(result.css).to.eql(expected);
            expect(result.warnings()).to.be.empty;
            done();
        }).catch(function (error) {
        done(error);
    });

};

describe('postcss-modular-scale-plus', function() {

    it('should not fail on nonsensical inputs', function(done) {
        test('nonsense', {}, done);
    });

    it('should calculate the modular scale correctly', function(done) {
        test('scale', {}, done);
    });

    it('works when no parameters are passed in', function(done) {
        test('null', {}, done);
    });

    it('works with nested values', function(done) {
        test('nested-values', {}, done);
    });
});