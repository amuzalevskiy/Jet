define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var BooleanField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            defaultValue: false,

            parseJSON: function (value) {
                if (value == undefined) {
                    return undefined;
                }
                return !!value;
            },

            prepareJSON: function (value) {
                return !!value;
            }
        });

        return BooleanField;

    }
)