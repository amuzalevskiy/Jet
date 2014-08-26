define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var ConstructorField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            scope: Jet.scope,
            decl: {
                fields: [
                    {
                        name: 'scope',
                        required: true
                    }
                ]
            },
            _set: function (model, value) {
                if (this._setNative(model, value)) {
                    return 1;
                }
            }
        });

        return ConstructorField;

    }
)