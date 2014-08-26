define(
    [
        './Jet',
        'module'
    ],
    function (Jet, module) {
        /**
         * Property of model
         */
        var Property = function (model, field) {
            this.model = model;
            this.field = field;
        };

        Property.prototype = {
            moduleId: module.id,
            get: function () {
                return this.field._get(this.model);
            },
            set: function (value) {
                this.field._set(this.model, value);
            },
            getView: function (name, options) {
                var builder = Jet.theme.getBuilder(this.field, 'prop_' + name);
                return builder.build(this, options);
            }
        };

        _.extend(Property.prototype, Jet.Events);

        // just
        Property.moduleId = module.id;

        return Property;
    }
);