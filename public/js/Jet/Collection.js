define(
    [
        'module',
        './Impl/CollectionImpl',
        './Impl/StdClassImpl',
        './Jet'
    ],

    function(module, CollectionImpl, StdClassImpl, Jet){

        /**
         * Backbone collection is a stratch.
         *
         * Additionally creates getBy<FieldName> functions
         */
        var Collection = CollectionImpl.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            decl: {
                fields: [
                    {
                        name: "strict",
                        jet: "Boolean"
                    },
                    {
                        name: "itemConstructor",
                        jet: "Constructor",
                        scope: Jet.scope,
                        defaultValue: StdClassImpl
                    },
                    {
                        name: "items",
                        depend: "itemConstructor",
                        _set: function (collection, value) {
                            collection.reset(value);
                        },
                        defaultValue: function () {
                            return [];
                        }
                    }
                ]
            },

            constructor: function (attributes) {
                if (_.isArray(attributes) || attributes instanceof Collection) {
                    attributes = {
                        items: attributes
                    }
                };
                this.parse(attributes || {});
            },

            /**
             * Better to JSON realization. Allows to store fields if them was defined | changed
             *
             * @param scope
             * @returns {*}
             */
            toJSON: function (scope) {
                var fields = StdClassImpl.prototype.toJSON.call(this, scope), items = [];
                var modelScope = this.model.prototype.moduleId; // as string
                for (var i = 0; i < this.items.length; i++) {
                    items.push(this.items[i].toJSON(modelScope));
                }
                if (_.keys(fields).length) {
                    fields.items = items;
                    return fields;
                }
                // don't return empty collection
                return items.length ? items : undefined;
            }
        });


        Jet.mixin('decl', {
            constructor: Collection,
            decl: Collection.prototype.decl
        });

        var ClassDecl;

        Collection.extend = function (protoProps, staticProps) {
            !staticProps && (staticProps = {});
            if (protoProps.moduleId) {
                staticProps.moduleId = protoProps.moduleId;
            }

            if (!staticProps.fromJSON) {
                staticProps.fromJSON = Collection.fromJSON;
            }

            var ext = StdClassImpl.extend.call(this, protoProps, staticProps, false);

            ext.extend = Collection.extend;


            Jet.mixin('decl', {
                constructor: ext,
                decl: protoProps.decl
            });

            // register shortcuts
            // findBy<Field>
            try {
                var itemConstructor = ext.getDecl().fields.findByName('itemConstructor').defaultValue,
                    proto = ext.prototype;
                // is Generator
                if (itemConstructor.moduleId) {

                    itemConstructor.getDecl().fields.each(function (field) {
                        var name = field.name,
                            capName = name[0].toUpperCase() + name.substr(1);
                        proto['findBy' + capName] = function (x) {
                            var m = this.items, l = m.length;
                            for (var i = 0; i < l; i++) {
                                if (m[i].get(name) == x)
                                    return m[i];
                            }
                        }
                        proto['where' + capName] = function (x) {
                            var m = this.items, l = m.length, res = [];
                            for (var i = 0; i < l; i++) {
                                if (m[i].get(name) == x)
                                    res.push(m[i]);
                            }
                            return res;
                        }
                    });
                } else {
                    throw "Cannot generate item constructor. There is no model to pass into it!"
                }
            } catch (e) {}

            Jet.addConstructor(ext);

            return ext;
        };

        return Collection;
    }
)