var postcss = require('postcss');
var ModularScale = require('modular-scale');
var reduceFunctionCall = require('reduce-function-call');

module.exports = postcss.plugin('postcss-modular-scale-plus', function (opts) {
    opts = opts || {};
    var ratios = opts.ratios;
    var bases = opts.bases;

    return function (css) {
        var ms = null;

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

        ms = new ModularScale({ ratios: ratios, bases: bases });

        css.walkDecls(function (decl) {
            if (!decl.value || decl.value.indexOf('ms(') === -1) {
                return;
            }

            decl.value = reduceFunctionCall(decl.value, 'ms', function (body) {
                return ms(parseInt(body, 10));
            });
        });
    };
});
