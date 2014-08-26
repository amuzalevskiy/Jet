/**
 * Object that could be extended in Backbone way
 */

define(
    [
        'module',
        '../Jet',
        '../Property'
    ],

    function (module, Jet, Property) {
        var StdClassImpl = function (options) {
            this._props = {};
            this.parse(options || {});
        };

        StdClassImpl.moduleId = module.id;
        StdClassImpl.prototype = {
            moduleId: module.id,
            getDecl: function (strict) {
                if (this.constructor.getDecl) {
                    return this.constructor.getDecl(strict);
                }
                if (strict !== false) {
                    throw new Error("Class <" + this.moduleId + "> has no declaration");
                }
            },
            parse: function (options) {
                // store initialization options
                this.initOptions = options;
                var fields = this.getDecl().fields.items;
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i],
                        raw = options[field.name],
                        parsed = (raw !== undefined)
                                    ? field.parseJSON(raw)
                                    : (
                                        (_.isFunction(field.defaultValue) && /* is constructor? */!(field.defaultValue.moduleId)
                                            ? field.defaultValue(this, options)
                                            : field.defaultValue)
                                    );
                    if (parsed !== undefined) {
                        field._set(this, parsed);
                        field.onUpdate && field.onUpdate(this);
                    } else if (field.required) {
                        throw new Error("Field <" + field.name + "> is required in <" + this.moduleId + ">");
                    }
                }
            },

            /**
             * getters/setter by field-name
             */
            _g: undefined,
            _s: undefined,

            get: function (name) {
                var fn = this._g[name];
                if (!fn) {
                    throw new Error("Cannot get undeclared field <" + name + ">");
                }
                return fn.apply(this, arguments);
            },
            set: function (fieldName, value, options) {
                if (_.isString(fieldName)) {
                    fields = {};
                    fields[fieldName] = value;
                } else {
                    fields = fieldName;
                    options = value;
                }
                for (name in fields) {
                    var fn = this._s[name];
                    if (!fn) {
                        throw new Error("Cannot set undeclared field <" + name + ">");
                    }
                    return fn.call(this, fields[name], options);
                }
            },
            toJSON: function (scope) {
                if (_.isString(scope)) {
                    scope = Jet.getScope(scope);
                }
                var fields = this.getDecl().fields.items,
                    jetShortcut = scope ? scope.removeFromModuleId(this.moduleId) : this.moduleId,
                    res = jetShortcut ? {jet:jetShortcut} : {},
                    prepared;
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i], val = field._get(this);
                    if (val != field.defaultValue)
                        if (undefined !== (prepared = field.prepareJSON(val)))
                            res[field.name] = prepared;
                }
                return res;
            },

            /**
             * Contains all object properties
             */
            _props: null,

            /**
             * Return property by Name
             *
             * @param name
             * @return {Property}
             */
            getProperty: function (name) {
                var res;
                if (res = this._props[name]) {
                    return res;
                }
                var field = this.getDecl().fields.findByName(name);
                return this._props[name] = new Property(this, field);
            },

            // alias of getProperty
            prop: null,

            /**
             * Returns all properties of object
             *
             * @return {[Property]}
             */
            getProperties: function () {
                var res = [], thisCopy = this;
                this.getDecl().fields.each(function(field){
                    prop = thisCopy._props[field.name];
                    if (!prop) {
                        prop = thisCopy._props[field.name] = new Property(thisCopy, field);
                    }
                    res.push(prop);
                });
                return res;
            },

            destroy: function () {
                this.trigger('destroy');
                this.stopListening();
            },

            /**
             * Extract property
             *
             * @param x
             * @returns {*}
             */
            extract: function (x) {
                while (x instanceof Property)
                    x = x.get();
                return x;
            },

            /**
             * Extract array of properties
             *
             * @param x
             * @returns {*}
             */
            extractArray: function (xArr) {
                var newArr = [];
                for (var i = 0; i < xArr.length; i++) {
                    var x = xArr[i];
                    while (x instanceof Property)
                        x = x.get();
                    newArr.push(x);
                }
                return newArr;
            },

            /**
             * Extract map of properties
             *
             * @param x
             * @returns {*}
             */
            extractObj: function (xObj) {
                var newObj = {};
                for (var key in xObj) {
                    var x = xObj[key];
                    while (x instanceof Property)
                        x = x.get();
                    newObj[key] = x;
                }
                return newObj;
            }
        };

        _.extend(StdClassImpl.prototype, Jet.Events);

        StdClassImpl.prototype.prop = StdClassImpl.prototype.getProperty;
        StdClassImpl.fromJSON = function (json) {
            if (json instanceof StdClassImpl) {
                throw "Invalid json provided";
            }
            var constructor = this.scope.findConstructor(json.jet),
                fields = constructor.getDecl().fields.items,
                toSet = {};
            return new constructor(json);
        };

        // Helper function to correctly set up the prototype chain, for subclasses.
        // Similar to `goog.inherits`, but uses a hash of prototype properties and
        // class properties to be extended.
        StdClassImpl.extend = function (protoProps, staticProps, register) {
            !staticProps && (staticProps = {});
            if (register && !_.isString(protoProps.moduleId)) {
                throw new Error("moduleId should be defined");
            }
            staticProps.moduleId = protoProps.moduleId;

            if (!staticProps.fromJSON) {
                staticProps.fromJSON = StdClassImpl.fromJSON;
            }
            if (!staticProps.getDecl) {
                staticProps.getDecl = this.getDecl;
            }

            var parent = this;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function () {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            child.extend = StdClassImpl.extend;

            // register in jet toolkit
            if (register !== false)
                Jet.addConstructor(child);

            return child;
        };

        StdClassImpl.getDecl = function (strict) {
            if (strict === false)
                return;
            throw new Error("Please define getDecl() function");
        };

        Jet.addConstructor(StdClassImpl);

        return StdClassImpl;
    }
);