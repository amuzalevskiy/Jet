define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var IntField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            type: 'int',

            parseJSON: function (value) {
                if (isNaN(value)) {
                    return undefined;
                }
                return _.isNumber(value) ? value : new Number(value);
            }
        });

        return IntField;

    }
)