define(
    [
        'module',
        '../Panel',
        '../../Model/Content'
    ],
    function (Panel, Content) {
        return Panel.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "items",
                        jet: "Collection",
                        base: Content
                    }
                ]
            }
        });
    }
)