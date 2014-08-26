/**
 * Object that could be extended in Backbone way
 */

define(
    [
        './Jet',
        './Impl/StdClassImpl',
        './Collection',
        './ClassDecl'
    ],

    function (Jet, StdClassImpl, Collection) {
        var StdClass = StdClassImpl.extend({
            moduleId: 'Jet/StdClass', // root for all classes
            jet: Jet
        });

        StdClass.extend = function (protoProps, staticProps) {
            !staticProps && (staticProps = {});

            var ext = StdClassImpl.extend.call(this, protoProps, staticProps);

            ext.extend = StdClass.extend;

            Jet.mixin('decl', {
                constructor: ext,
                decl: protoProps.decl
            });
            if (!staticProps.Collection) {
                ext.Collection = Collection.extend({
                    moduleId: protoProps.moduleId + "/Collection",
                    decl: {
                        fields: [
                            {
                                name: "itemConstructor",
                                defaultValue: ext
                            }
                        ]
                    }
                });
            }
            return ext;
        };

        return StdClass;
    }
);