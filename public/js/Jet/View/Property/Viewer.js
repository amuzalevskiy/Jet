define([
        'module',
        'tpl!Jet/Form',
        '../Property'
],

    function (module, templateForm, Property) {

        var PropertyView = Property.extend({
            moduleId: module.id,
            register: {
                as: "prop_view",
                accept: "Jet/Field"
            },
            getInnerHTML: function () {
                var val = this.model.get();
                return val ? val.toString() : '<span class="j-empty-value">' + this.jet.locale.getEmptyValueText() + '</span>';
            }
        });

        return PropertyView;
    }
);