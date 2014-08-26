define([
        'module',
        '../Editor',
        'libs/jquery.numeric'
],

    function (module, Field) {
        return Field.extend({
            moduleId: module.id,
            register: {
                    as: "prop_edit",
                    accept: ["Jet/Field/Float", "Jet/Field/Int"]
            },
            decl: {
                fields: [
                    {
                        name: "value",
                        jet: "Accessor",
                        _get: function (model) {
                            return model._input ? parseFloat(model._input.val()) : undefined;
                        },
                        _set: function (model, value) {
                            model._input && model._input.val(value);
                        }
                    }
                ]
            },
            domRemove: function () {
                switch (this.model.field.type) {
                    case "int":
                    case "float":
                    case "decimal":
                        this._input.removeNumeric();
                        break;
                    default:
                }
                // cleanup
                this._input.remove();
                Field.prototype.domRemove.call(this);
            },
            afterDomCreate: function () {
                // shorthand
                this._input = this.$('input:first');
                switch (this.model.field.type) {
                    case "int":
                        this._input.numeric({ decimal: false });
                        break;
                    case "float":
                    case "decimal":
                        this._input.numeric({ decimal: '.' });
                        break;
                    default:
                        throw new Error("Not supported");
                }
                Field.prototype.afterDomCreate.call(this);
            },
        });
    }
)