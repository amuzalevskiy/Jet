define([
        'module',
        '../View',
        '../Property'
],

    function (module, View, Property) {

        var Property = View.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "model",
                        jet: "Object",
                        type: Property
                    },
                    {
                        name: "label",
                        jet: "Accessor",
                        _get: function (model) {
                            return model.model.field.getLabel();
                        }
                    },
                    {
                        name: "value",
                        jet: "Accessor",
                        _get: function (model) {
                            return model.model.get();
                        },
                        _set: function (model, value) {
                            return model.model.set(value);
                        }
                    }
                ]
            },
            initialize: function () {
                this.listenTo(this.model, "change", "render");
            }
        });

        return Property;
    }
);