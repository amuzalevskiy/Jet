define([
        'module',
        './StdClassImpl',
        './CollectionImpl'
    ],

    function (module, StdClassImpl, CollectionImpl) {

        /**
         * Gets value from model
         *
         * @param model
         * @returns {*}
         */
        function nativeGetter(model) {
            return model[this.name];
        }

        /**
         * Sets value on model
         *
         * @param model
         * @param value
         * @returns {boolean} true if value has been changed
         */
        function nativeSetter(model, value) {
            if (model[this.name] !== value) {
                model[this.name] = value;
                return true;
            }
        }

        var FieldImpl = StdClassImpl.extend({
            /**
             * overrides
             */
            moduleId: module.id,

            defaultValue: undefined,

            constructor: function (options) {
                this.name = options.name;
                this.defaultValue = options.defaultValue;
                this.required = options.required;
            },

            parseJSON: function (value) {
                return value;
            },

            prepareJSON: function (value) {
                return value;
            },

            _get: nativeGetter,
            _set: nativeSetter,
            _getFull: null,
            _setFull: null,
            _getNative: nativeGetter,
            _setNative: nativeSetter,

            getCapName: function () {
                var name = this.name;
                return name[0].toUpperCase() + name.substr(1);
            },
            getCapOneName: function () {
                var val = this.getCapName();
                var res = /^(.*)((s)es|([^s]{2})s)$/.exec(val);
                if (res)
                    val = res[1] + (res[3] ? res[3] : '') + (res[4] ? res[4] : '');
                return val;
            },
            addAccessorFns: function (protoProps) {
                var field = this,
                    name = this.name,
                    capName = this.getCapName(),
                    getterName = 'get' + capName,
                    setterName = 'set' + capName;

                protoProps._g[name] = protoProps[getterName] = this._getFull = function () {
                    return field._get(this);
                };

                protoProps._s[name] = protoProps[setterName] = this._setFull = function (value) {
                    var changed = field._set(this, value);
                    if (changed) {
                        field.onUpdate && field.onUpdate(this);
                        this.trigger("change:" + field.name);
                    }
                    return this;
                };
            }
        });

        FieldImpl.Collection = CollectionImpl.extend({
            itemConstructor: FieldImpl,
            moduleId: 'Collection/' + module.id,
            findByName: function (name) {
                for (var i = 0; i < this.items.length; i++) {
                    var field = this.items[i];
                    if (field.name == name)
                        return field;
                }
            }
        });
        return FieldImpl;

    }
)