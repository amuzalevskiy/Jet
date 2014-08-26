/**
 * Created by andrii.muzalevskyi on 24.08.2014.
 */
define(
    [
        'module',
        '../StdClass'
    ],
    function (module, StdClass) {

        /**
         *
         */
        var Action = StdClass.extend({
            moduleId: module.id,
            decl: {
                fields:[
                    {
                        name: "text",
                        jet: "String"
                    },
                    {
                        name: "icon",
                        jet: "String"
                    },
                    {
                        name: "link",
                        jet: "String"
                    },
                    {
                        name: "callback",
                        jet: "Function"
                    },
                    {
                        name: "context",
                        jet: "Object",
                        type: Object
                    },
                    {
                        name: "disabled",
                        jet: "Boolean"
                    },
                    {
                        name: "children",
                        jet: "Collection"
                    }
                ]
            }
        });

        Action.getDecl().fields.findWhere({name:'children'}).setBase(Action);

        return Action;

    }
);