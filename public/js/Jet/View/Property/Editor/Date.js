define([
        'module',
        '../Editor',
        'libs/datepicker/js/bootstrap-datepicker'
    ],

    function(module, Field){
        return Field.extend({
            moduleId: module.id,
            register: {
                as: "prop_edit",
                accept: "Jet/Field/Date"
            },
            decl: {
                fields: [
                    {
                        name: "value",
                        jet: "Accessor",
                        _get: function (model) {
                            return model._input ? model._input.datepicker("getValue")[0] : undefined;
                        },
                        _set: function (model, value) {
                            model._input && model._input.datepicker("setValue", value);
                        }
                    }
                ]
            },
            domRemove: function () {
                this._input.remove();
                Field.prototype.domRemove.call(this);
            },
            afterDomCreate: function () {
                // shorthand
                this._input = this.$('input:first');
                this._input.datepicker();
                Field.prototype.afterDomCreate.call(this);
            }
        });
    }
)