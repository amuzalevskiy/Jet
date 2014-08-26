/**
 * Default template realization
 */

define(
    [
        'module',
        './StdClass'
    ],

    function (module, StdClass) {
        var __counters = {};
        var _addCounter = function (source) {
            if (__counters[source] !== undefined) {
                __counters[source]++;
                return source + '[' + __counters[source] + ']';
            } else {
                __counters[source] = 0;
                return source;
            }
        }
        var Template = StdClass.extend({
            moduleId: module.id,

            container: {
                tagName: 'div',
                className: undefined,
                attributes: undefined
            },

            innerHTML: "",

            getInnerHTML: function (owner) {
                return this.innerHTML;
            }
        });

        return Template;
    }
);