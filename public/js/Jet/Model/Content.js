define(
    [
        '../StdClass'
    ],
    function (StdClass) {
        return StdClass.extend({
            decl: {
                fields: [
                    {
                        name: "icon",
                        jet: "String"
                    },
                    {
                        name: "title",
                        jet: "String"
                    },
                    {
                        name: "content",
                        jet: "Object",
                        base: Object
                    }
                ]
            }
        });
    }
);