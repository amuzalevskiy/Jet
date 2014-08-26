define([
        'module',
        './Jet',
        './Impl/FieldImpl',
        './Impl/CollectionImpl',
        './ClassDecl/Quick'
    ],

    function(module, Jet, FieldImpl, CollectionImpl){

        var decl;

        var Field = FieldImpl.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            type: undefined,
            decl: {
                fields: [
                    {name: "name", jet: "String"},
                    {
                        name: "label",
                        jet: "Accessor",
                        _get: function (model) {
                            return model.label || (model.name[0].toUpperCase() + model.name.substr(1));
                        },
                        _set: function (model, value) {
                            model.label = value;
                        }
                    },
                    {name: "defaultValue"},
                    {name: "required", jet: "Boolean"},
                    {name: "depend", jet: "String"},
                    {name: "onUpdate", jet: "Function"},
                    {name: "_get", jet: "Function"},
                    {name: "_set", jet: "Function"}
                ]
            },
            constructor: function (options) {
                this.parse(options);
            }
        });

        Jet.mixin('quickdecl', {
            constructor: Field,
            decl: Field.prototype.decl
        });

        Field.Collection = FieldImpl.Collection.extend({
            itemConstructor: Field,
            moduleId: 'Collection/' + module.id
        });

        Field.extend = function (protoProps, staticProps) {
            !staticProps && (staticProps = {});

            var ext = FieldImpl.extend.call(this, protoProps, staticProps);

            ext.extend = Field.extend;

            Jet.mixin('quickdecl', {
                constructor: ext,
                decl: protoProps.decl
            });

            return ext;
        };

        return Field;

    }
)