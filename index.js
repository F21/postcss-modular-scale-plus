var postcss = require('postcss');
var reduceFunctionCall = require('reduce-function-call');

var msBases = [1];
var msRatios = [(1 + Math.sqrt(5)) / 2];

var ratioNames = {
    minorSecond: 1.067,
    majorSecond: 1.125,
    minorThird: 1.2,
    majorThird: 1.25,
    perfectFourth: 1.333,
    augFourth: 1.414,
    perfectFifth: 1.5,
    minorSixth: 1.6,
    goldenSection: 1.618,
    majorSixth: 1.667,
    minorSeventh: 1.778,
    majorSeventh: 1.875,
    octave: 2,
    majorTenth: 2.5,
    majorEleventh: 2.667,
    majorTwelfth: 3,
    doubleOctave: 4
};

// Unique via http://jsfiddle.net/gabrieleromanato/BrLfv/
function msUnique(origArr) {

    origArr = origArr.sort(function (a, b) {
        var x = a[0];
        var y = b[0];
        return x - y;
    });

    var newArr = [];
    var lastVal = null;

    for (var i = 0; i < origArr.length; i++) {
        var currentVal = origArr[i][0];

        if (currentVal !== lastVal) {
            newArr.push(origArr[i]);
        }

        lastVal = currentVal;

    }

    return newArr;
}

function ms(value, bases, ratios) {

    bases = bases &&
        Array.isArray(bases) && bases.length ? bases : msBases;
    ratios = ratios &&
        Array.isArray(ratios) && ratios.length ? ratios : msRatios;

    bases = bases.map(function (base) {
        if (typeof base === 'string') {
            base = parseFloat(base);
        }
        return base || msBases;
    });

    ratios = ratios.map(function (ratio) {
        if (typeof ratio === 'string') {
            ratio = ratioNames[ratio] ? ratioNames[ratio] :
                parseFloat(ratio);
        }

        return ratio || msRatios;
    });

    // Seed return array
    var r = [];
    var strand = null;

    for (var ratio = 0; ratio < ratios.length; ratio++) {
        for (var base = 0; base < bases.length; base++) {

            strand = base + ratio;

            // Seed list with an initial value
            // r.push(bases[base]);

            // Find values on a positive scale
            if (value >= 0) {
                // Find lower values on the scale
                var i = 0;
                while (Math.pow(ratios[ratio], i) * bases[base] >= bases[0]) {
                    r.push([Math.pow(ratios[ratio], i) * bases[base], strand]);
                    i--;
                }

                // Find higher possible values on the scale
                var i = 0;
                while (Math.pow(ratios[ratio], i) * bases[base] <= Math.pow(ratios[ratio], value + 1) * bases[base]) {
                    r.push([Math.pow(ratios[ratio], i) * bases[base], strand]);
                    i++;
                }
            } else {
                // Find values on a negitve scale
                var i = 0;
                while (Math.pow(ratios[ratio], i) * bases[base] <= bases[0]) {
                    r.push([Math.pow(ratios[ratio], i) * bases[base], strand]);
                    i++;
                }

                // // Find higher possible values on the scale
                var i = 0;
                while ((Math.pow(ratios[ratio], i) * bases[base]) >= (Math.pow(ratios[ratio], value - 1) * bases[base])) {
                    if (Math.pow(ratios[ratio], i) * bases[base] <= bases[0]) {
                        r.push([Math.pow(ratios[ratio], i) * bases[base], strand]);
                    }
                    i--;
                }
            }
        }
    }

    r = msUnique(r);

    // reverse array if value is negitive
    if (value < 0) {
        r = r.reverse();
    }

    return r[Math.abs(value)][0];
}

module.exports = postcss.plugin('postcss-modular-scale-plus', function (opts) {

    opts = opts || {};
    var ratios = opts.ratios;
    var bases = opts.bases;

    return function (css) {

        css.walkDecls(function (decl) {

            if (!decl.value) {
                return;
            }

            if (decl.parent.selector === ':root') {

                if (decl.prop === '--ms-ratios') {
                    ratios = decl.value.split(',');
                }

                if (decl.prop === '--ms-bases') {
                    bases = decl.value.split(',');
                }
            }
        });

        css.walkDecls(function (decl) {
            if (!decl.value || decl.value.indexOf('ms(') === -1) {
                return;
            }

            decl.value = reduceFunctionCall(decl.value, 'ms', function (body) {
                return ms(parseFloat(body), bases, ratios);
            });
        });
    };
});
