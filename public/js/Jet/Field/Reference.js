define(
    [
        'module',
        '../Jet',
        '../Field',
        '../Reference'
    ],

    function(module, Jet, Field, Reference){

        var ReferenceField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            parseJSON: function (value) {
                return new Reference(value);
            }
        });

        return ReferenceField;

    }
)