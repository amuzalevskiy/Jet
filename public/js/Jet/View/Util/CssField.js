define([
        'module',
        '../../Field/Html/CssProp'
    ],

    function (module, CssPropField) {

        return CssPropField.extend({
            moduleId: module.id,
            _get: function (model) {
                var res = (model.css || (model.css = {}))[this.name];
                if (res) return res;
                return model.$el.css(this.name);
            },
            onUpdate: function (model) {
                if (model.$el) {
                    model.$el.css(this.name, model.css[this.name] || "");
                }
            }
        });

    }
)