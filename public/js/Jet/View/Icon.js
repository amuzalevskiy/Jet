/**
 * Created by andrii.muzalevskyi on 24.08.2014.
 */
define(
    [
        'module',
        '../View'
    ],
    function (module, View) {

        var Icon = View.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "name",
                        type: "String",
                        onUpdate: function (icon) {
                            icon.html = "<span class='icon-" + icon.name + "'></span>";
                        }
                    }
                ]
            }
        });

        return Icon;

    }
);