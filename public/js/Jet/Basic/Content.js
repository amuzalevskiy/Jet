/**
 * stores key-value pair
 */

define(
    [
        'module',
        '../Jet',
        '../StdClass',
        'tpl!Jet/Basic:Content'
    ],

    function (module, Jet, StdClassImpl, templateContent) {
        var Content = StdClassImpl.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "title",
                        jet: "String"
                    },
                    {
                        name: "content",
                        jet: "String"
                    },
                    {
                        name: "revision",
                        jet: "Float"
                    },
                    {
                        name: "created",
                        jet: "Date"
                    }
                ],
                views: {
                    view: {
                        template: templateContent
                    }
                }
            }
        });

        return Content;
    }
);