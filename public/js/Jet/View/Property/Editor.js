define([
        'module',
        'tpl!Jet/Form',
        '../Property'
],

    function (module, templateForm, Property) {

        var PropertyEditor = Property.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "value",
                        jet: "Accessor",
                        _get: function (model) {
                            return model._input ? model._input.val() : model.model.get();
                        },
                        _set: function (model,value) {
                            model._input && model._input.val(value);
                        }
                    }
                ]
            },
            register: {
                as: "prop_edit",
                accept: "Jet/Field"
            },
            events: {
                "keyup input:first, change input:first": 'onChange'
            },
            template: templateForm.block.Input,
            onChange: function () {
                this.trigger("change:value");
            },
            focus: function () {
                this.$('input').focus();
            }
        });

        return PropertyEditor;
    }
);