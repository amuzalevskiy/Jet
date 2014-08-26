define(
    [
        './Scope',
        './Theme',
        './Locale',
        'libs/backbone.Events'
    ],
    function (Scope, Theme, Locale, BackboneEvents) {

        var mixins = {};
        var postponed = {};

        // it's global
        Jet = {
            Events: BackboneEvents,
            get: function (id) {
                var el = document.getElementById(id);
                return el ? el.jetView : undefined;
            },
            findConstructor: function (moduleId, strict) {
                return this.scope.findConstructor(moduleId, strict);
            },
            /**
             * @type {Scope}
             */
            scope: null,

            /**
             * Base theme. All generic views registered here.
             */
            baseTheme: null,

            /**
             * Could use your own.
             *
             * <code>
             * // replace theme (inherits baseTheme)
             * Jet.theme = new Theme(Jet, Jet.baseTheme);
             * // override some views
             * Jet.theme.addBuilders(View, {});
             * </code>
             */
            theme: null,

            locale: new Locale(),

            /**
             * Finds scope in tree
             * @param scope {String|Array}
             * @returns {Scope}
             */
            getScope: function (scope, strict){
                return this.scope.getSubScope(scope, strict);
            },
            addConstructor: function (constructor) {
                if (!_.isString(constructor.moduleId)) {
                    throw new Error("moduleId should be defined");
                }
                this.getScope(constructor.moduleId).setConstructor(constructor);
            },

            /**
             * Mixin some functionality into another object
             *
             * @param object
             * @param args {[]|undefined}
             * @returns {String}
             */
            mixin: function (mixinName, obj) {
                if (mixins[mixinName]) {
                    mixins[mixinName].call(obj);
                } else {
                    (postponed[mixinName] = postponed[mixinName] || []).push(obj);
                }
            },
            /**
             * Adds mixin
             */
            addMixin: function (mixinName, mixin) {
                mixins[mixinName] = mixin;
                if (postponed[mixinName]) {
                    var postponedObjects = postponed[mixinName];
                    for (var i = 0; i < postponedObjects.length; i++) {
                        mixin.call(postponedObjects[i]);
                    }
                }
                delete postponed[mixinName];
            },

            createEmptyObj: function () {
                return {};
            },

            emptyFn: function () { }
        };

        _.extend(Jet, Jet.Events);

        Jet.scope = new Scope("__root__", null, Jet, true);
        Jet.baseTheme = Jet.theme = new Theme(Jet);
        return Jet;
    }
);