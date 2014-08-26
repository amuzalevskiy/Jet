define([
        'module',
        'tpl!Jet/Decorator/Label',
        '../Decorator'
    ],

    function (module, templateDecoratorLabel, Decorator) {

        return Decorator.extend({
            moduleId: module.id,
            events: {
                "mouseup label": 'onLabelClick'
            },
            decl: {
                fields: [
                    {
                        name: "label",
                        _get: function (model) {
                            return model.label || model.getInner().getLabel();
                        }
                    }
                ]
            },
            template: templateDecoratorLabel,
            onLabelClick: function () {
                this.inner.focus();
            }
        });
    }
);