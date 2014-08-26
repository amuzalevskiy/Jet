define(
    [
        'module',
        './Jet',
        './Impl/StdClassImpl'
    ],

    function (module, Jet, StdClassImpl) {

        /**
         * Perform view building by viewClass, options, template.
         */
        var Builder = StdClassImpl.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    { name: "viewClass", jet: "Constructor", scope: Jet.getScope('Jet/View') },
                    { name: "options" },
                    { name: "modelParameter", defaultValue: "model" },
                    { name: "template" }
                ]
            },

            build: function (obj, options) {
                var constructor = this.getViewClass();
                options = _.extend({}, this.options, options);
                this.template && (options.template = this.template);
                options[this.modelParameter] = obj;
                return new constructor(options);
            }
        });

        Jet.mixin('decl', {
            constructor: Builder,
            decl: Builder.prototype.decl
        });

        return Builder;
    }
);