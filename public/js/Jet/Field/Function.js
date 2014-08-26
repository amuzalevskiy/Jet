define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var FunctionField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            parseJSON: function (value) {
                if (_.isFunction(value)) {
                    return value;
                } else if (_.isString(value)) {
                    try {
                        return eval("var _z; _z = " + value);
                    } catch (e) {}
                }
            },
            prepareJSON: function (value) {
                if(!_.isFunction(value)) {
                    return;
                }
                return value.toString();
            }
        });

        return FunctionField;

    }
)