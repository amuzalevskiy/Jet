define(
    [
        'underscore',
        './Scope'
    ],
    function (_, Scope){

        var Builder;
        /**
         * Theming support
         */
        var Theme = function (Jet, baseTheme) {
            this.map = {};
            this.base = baseTheme;
            this.jet = Jet;
        };

        Theme.prototype = {
            /**
             * Returns view builder for model
             *
             * @param scope {Constructor|StdClass|String}
             * @param view {String} name of view to get
             * @returns {*}
             */
            getBuilder: function (scope, view) {
                // late parsing
                if (!Builder)
                    Builder = this.jet.findConstructor('Jet/ViewBuilder');

                // default view
                !view && (view = 'view');

                if (!(scope instanceof Scope)) {
                    if (scope.constructor) {
                        // got instance of class
                        scope = scope.constructor.scope;
                    } else {
                        // maybe string, find it
                        this.jet.getScope(scope);
                    }
                }

                var scope_copy = scope;

                // iterate into parents
                while (scope_copy) {
                    var builders = this.map[scope_copy.name],
                        builder;

                    if (builders && (builder = builders[view])) {
                        if (!(builder instanceof Builder)) {
                            builder = builders[view] = Builder.fromJSON(builder);
                        }
                        return builder;
                    }

                    scope_copy = scope_copy.classParentScope;
                }

                // try base theme
                if (this.base) {
                    return this.base.getBuilder(scope, view);
                }

                throw new Error("Cannot find view <" + view + "> for <" + scope.name + ">");
            },
            /**
             * Adds view builders to theme
             *
             * @param scope {Constructor|StdClass|String}
             * @param views {Object}
             */
            addBuilders: function(scope, views) {
                if (_.isArray(scope)) {
                    for (var i = 0; i < scope.length; i++) {
                        this.addBuilders(scope[i], views);
                    }
                    return;
                }
                var id = scope.moduleId ? scope.moduleId : scope;
                !this.map[id] && (this.map[id] = {});
                _.extend(this.map[id], views);
            },

            /**
             * Return all registered applicable builders
             *
             * @param scope {Constructor|StdClass|String}
             */
            getAllBuilders: function (scope) {
                var id = scope.moduleId ? scope.moduleId : scope;
                throw "Not realized";
            }
        };
        return Theme;
    }
);