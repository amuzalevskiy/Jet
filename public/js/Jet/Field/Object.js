define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function(module, Jet, Field){

        var ObjectField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            decl: {
                fields: [
                    { name: "type" },
                    { name: "autodestroy", jet: "Boolean"}
                ]
            },

            parseJSON: function (value) {
                if (!this.type || value instanceof this.type) {
                    return value;
                }
                return new this.type(value);
            },

            prepareJSON: function (value) {
                if(!value) return;
                return value.toJSON(this.type);
            },

            _set: function (model, value) {
                if (value == this._get(model)){
                    return;
                }
                if (this.autodestroy && model[this.name]) {
                    model.stopListening(model[this.name]);
                }
                if (value && this.type && !(value instanceof this.type)) {
                    throw new Error("Attribute <" + this.name + "> accepts only instances of <" + this.type.prototype.moduleId + ">");
                }
                if (this.autodestroy) {
                    model.listenTo(value, 'destroy', model.destroy);
                }
                model[this.name] = value;
                return 1;
            }
        });

        return ObjectField;

    }
)