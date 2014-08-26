define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var AccessorField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            _get: function (model) {
                throw new Error("Field <" + this.name + "> has no getter");
            },

            _set: function (model) {
                throw new Error("Could not set readonly field <" + this.name + ">")
            },

            parseJSON: function (value) {
                return;
            },

            prepareJSON: function (value) {
                // never store it
                return undefined;
            }
        });

        return AccessorField;

    }
)