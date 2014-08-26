define(
    [
        'module',
        '../Jet',
        '../Field',
        '../Collection'
    ],

    function(module, Jet, Field){

        var CollectionField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            decl: {
                fields: [
                    {name:"base"},
                ]
            },

            defaultValue: function () {
                return new this.base.Collection({ strict: true });
            },

            parseJSON: function (value) {
                if(value instanceof this.base.Collection) {
                    return value;
                }
                return new this.base.Collection({items: value, strict: true});
            },

            prepareJSON: function (value) {
                return value.toJSON(this.base.Collection.prototype.moduleId);
            }
        });

        return CollectionField;

    }
)