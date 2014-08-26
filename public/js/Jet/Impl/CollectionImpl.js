define(
    [
        'module',
        './StdClassImpl',
        '../Jet'
    ],

    function(module, StdClassImpl){
        var slice = Array.prototype.slice;
        /**
         * Backbone collection is a stratch.
         *
         * Additionally creates getBy<FieldName> functions
         */
        var CollectionImpl = StdClassImpl.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            itemConstructor: StdClassImpl,

            /**
             * @type {Array}
             */
            items: null,

            constructor: function (attributes) {
                this._reset();
                if(_.isArray(attributes)){
                    this.add(attributes, {silent: true});
                } else {
                    if (attributes && attributes.itemConstructor) {
                        this.itemConstructor = attributes.itemConstructor;
                    }
                    if (attributes && attributes.items) {
                        this.add(attributes.items, {silent: true});
                    }
                }
            },

            add: function (items, options) {
                if (!_.isArray(items)) {
                    items = [items];
                }
                var silent = (options && options.silent),
                    at = (options && options.at);
                for (var i = items.length - 1; i >= 0; i--) {
                    var model = this._prepareModel(items[i]);
                    if (-1 == this.indexOf(model))
                        this.listenTo(model, 'all', this._onModelEvent);
                    if (at !== undefined) {
                        this.items.splice(at,0,model);
                        at = Math.max(at, this.length);
                    } else {
                        this.items.push(model);
                        at = this.length;
                    }
                    !silent && this.trigger('add', model, at);
                }
                this.length = this.items.length;
            },


            remove: function (items, options) {
                if (!_.isArray(items)) {
                    items = [items];
                }
                var silent = (options && !options.silent);
                for (var i = 0; i < items.length; i++) {
                    var index = this.indexOf(items[i]);
                    if (index != -1) {
                        this.items.splice(index, 1);
                        !silent && this.trigger('remove', items[i], index);
                        if (-1 == this.indexOf(items[i]))
                            this.stopListening(items[i]);
                    }
                }
                this.length = this.items.length;
            },

            // Get the model at the given index.
            at: function(index) {
                return this.items[index];
            },

            // Add a model to the end of the collection.
            push: function(model, options) {
                model = this._prepareModel(model, options);
                this.add(model, _.extend({at: this.length}, options));
                return model;
            },

            // Remove a model from the end of the collection.
            pop: function(options) {
                var model = this.at(this.length - 1);
                this.remove(model, options);
                return model;
            },

            // Add a model to the beginning of the collection.
            unshift: function(model, options) {
                model = this._prepareModel(model, options);
                this.add(model, _.extend({at: 0}, options));
                return model;
            },

            // Remove a model from the beginning of the collection.
            shift: function(options) {
                var model = this.at(0);
                this.remove(model, options);
                return model;
            },

            // Slice out a sub-array of items from the collection.
            slice: function(begin, end) {
                return this.items.slice(begin, end);
            },

            // Return items with matching attributes. Useful for simple cases of
            // `filter`.
            where: function(attrs, first) {
                if (_.isEmpty(attrs)) return first ? void 0 : [];
                return this[first ? 'find' : 'filter'](function(item) {
                    for (var key in attrs) {
                        if (attrs[key] !== item.get(key)) return false;
                    }
                    return true;
                });
            },

            // Return the first model with matching attributes. Useful for simple cases
            // of `find`.
            findWhere: function(attrs) {
                return this.where(attrs, true);
            },

            // Create a new collection with an identical list of items as this one.
            clone: function() {
                return new this.constructor(this.toJSON(this.constructor.scope));
            },

            _onModelEvent: function (event, model) {
                if (event === 'destroy') this.remove(model);
            },

            _reset: function () {
                this.items = [];
                this.length = 0;
            },

            /**
             * Reset's collection state
             *
             * @param items {Array|CollectionImpl}
             * @param options
             */
            reset: function (items, options) {
                this._reset();
                // duck typing
                // should pass CollectionImpl and View.Collection (View is parent here)
                if (items.getItems && items.items && items.items.length !== undefined) {
                    items = items.items;
                }
                if (items && items.length) {
                    this.add(items, _.extend({silent: true}, options));
                }
                (options && !options.silent) || this.trigger('reset', this.items);
            },

            // Prepare a hash of attributes (or other model) to be added to this
            // collection.
            _prepareModel: function(attrs) {
                if (attrs instanceof this.itemConstructor) {
                    return attrs;
                }
                if (attrs instanceof StdClassImpl) {
                    throw "Collection accepts only <" + this.itemConstructor.moduleId + "> instances. <" + attrs.moduleId + "> instance provided"
                }
                return this.itemConstructor.fromJSON(attrs);
            },
            toJSON: function (scope) {
                var items = [];
                var modelScope = this.itemConstructor.prototype.moduleId; // as string
                for (var i = 0; i < this.items.length; i++) {
                    items.push(this.items[i].toJSON(modelScope));
                }
                return items.length ? items : undefined;
            }
        });

        // Underscore methods that we want to implement on the Collection.
        // 90% of the core usefulness of Collections is actually implemented
        // right here:
        var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
            'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
            'reject', 'every', 'all', 'some', 'any', /*'include' is alias of contains, also it is used in View ,*/ 'contains', 'invoke',
            'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
            'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
            'isEmpty', 'chain'];

        // Mix in each Underscore method as a proxy to `Collection#models`.
        _.each(methods, function(method) {
            CollectionImpl.prototype[method] = function() {
                var args = slice.call(arguments);
                args.unshift(this.items);
                return _[method].apply(_, args);
            };
        });

        return CollectionImpl;
    }
)