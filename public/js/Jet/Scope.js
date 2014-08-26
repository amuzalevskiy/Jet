define(
    [],
    function (){

        /**
         * Jet scope implementation
         */
        var Scope = function (name, parent, jet, isMain) {
            this.sub = {};
            this.isMain = isMain;
            this.name = ((parent && !parent.isMain) ? parent.name +'/' : '') + name;
            this.parent = parent;
            this.jet = jet;
        };
        Scope.prototype = {

            getConstructor: function () {
                if (!this.c) {
                    throw new Error("Scope <" + this.name + "> doesn't have constructor");
                }
                return this.c;
            },

            setConstructor: function (c) {
                c.scope = this;
                this.c = c;
                c.__super__ && (this.classParentScope = c.__super__.constructor.scope);
            },

            parseStringModuleId: function (id) {
                return id.split(/\/+/);
            },

            /**
             * Finds scope in tree
             * @param scope {String|Array}
             * @returns {Scope}
             */
            getSubScope: function (scope, strict) {
                if (_.isString(scope)) {
                    scope = this.parseStringModuleId(scope);
                }
                var x = scope.shift(), inner;
                if (!(inner = this.sub[x])) {
                    if (strict)
                        throw new Error("Cannot find scope <" + scope.join("/") + "> in <" + this.name + ">");
                    inner = this.sub[x] = new Scope(x, this, this.jet);
                }
                return scope.length ? inner.getSubScope(scope) : inner;
            },

            /**
             * Removes scope from moduleId
             *
             * @param moduleId {String}
             * @returns {String}
             */
            removeFromModuleId: function (moduleId) {
                if (moduleId == this.name) {
                    return; // return undefined
                }
                if (moduleId.substr(0, this.name.length) == this.name && moduleId[this.name.length] == '/') {
                    return moduleId.substr(this.name.length + 1);
                }
                return moduleId;
            },

            findConstructor: function (moduleId, strict) {
                var scope = moduleId ? this.getSubScope(moduleId, strict) : this;
                return scope.getConstructor();
            }
        }
        return Scope;
    }
);