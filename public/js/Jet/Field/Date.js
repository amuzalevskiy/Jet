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
            type: 'date',

            parseJSON: function (value) {
                return new Date(value);
            }
        });

        return IntField;

    }
)