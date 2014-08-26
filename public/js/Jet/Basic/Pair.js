/**
 * stores key-value pair
 */

define(
    [
        'module',
        '../Jet',
        '../Impl/StdClassImpl',
        '../Impl/CollectionImpl'
    ],

    function (module, Jet, StdClassImpl, CollectionImpl) {

        /**
         * Stores key-value pair
         *
         * Required for ClassDecl
         */

        var Pair = StdClassImpl.extend({
            moduleId: module.id,
            model: StdClassImpl,
            decl: {
                fields: [
                    {
                        name: "key",
                        jet: "String"
                    },
                    {
                        name: "value"
                    }
                ]
            },
            constructor: function (attrs) {
                attrs.key && (this.key = attrs.key);
                attrs.value && (this.value = (attrs.value instanceof this.model ? attrs.value : new this.model(attrs.value)));
            }
        });

        Jet.mixin('quickdecl', {
            constructor: Pair,
            decl: Pair.prototype.decl
        });

        Pair.Collection = CollectionImpl.extend({
            moduleId: "Collection/" + module.id,
            itemConstructor: Pair,
            constructor: function (attributes) {
                if (_.isPlainObject(attributes.items)) {
                    this._reset();
                    for (var key in attributes.items) {
                        this.add(new this.model({
                            key: key,
                            value: attributes.items[key]
                        }), {silent: true})
                    }
                } else {
                    CollectionImpl.prototype.constructor.call(this, attributes);
                }
            },
            get: function (key) {
                for (var i = 0; i < this.items.length; i++) {
                    var model = this.items[i];
                    if (model.key == key)
                        return model.value;
                }
            }
        });

        Pair.extend = function (protoProps, staticProps) {
            !staticProps && (staticProps = {});

            if (!protoProps.model) {
                throw new Error("Please specify model for Pair child");
            }

            protoProps.moduleId = "Pair/" + protoProps.model.moduleId;

            var ext = StdClassImpl.extend.call(this, protoProps, staticProps);

            ext.extend = Pair.extend;

            Jet.mixin('quickdecl', {
                constructor: ext,
                decl: protoProps.decl
            });

            ext.Collection = this.Collection.extend({moduleId: 'Collection/' + protoProps.moduleId, itemConstructor: ext});

            return ext;
        };
        return Pair;
    }
);