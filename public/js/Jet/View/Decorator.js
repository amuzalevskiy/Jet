define([
        'module',
        '../View'
],

    function (module, View) {

        var Decorator = View.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "inner",
                        jet: "Object",
                        type: View,
                        required: true,
                        onUpdate: function (model) {
                            model.inner.addCssClass(model.idScope + 'inner');
                        },
                        final: true
                    }
                ]
            },

            focus: function () {
                this.inner.focus();
            }
        });

        return Decorator;

    }
)