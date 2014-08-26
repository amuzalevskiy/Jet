define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var FloatField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            type: 'float',

            parseJSON: function (value) {
                return new Number(value);
            }
        });

        return FloatField;

    }
)