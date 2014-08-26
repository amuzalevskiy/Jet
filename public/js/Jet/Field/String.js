define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var StringField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            type: 'string',

            parseJSON: function (value) {
                return value.toString();
            }
        });

        return StringField;

    }
)