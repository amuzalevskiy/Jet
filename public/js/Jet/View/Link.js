/**
 * Created by andrii.muzalevskyi on 25.08.2014.
 */
define(
    [
        'module',
        './Button',
        '../IconSet'
    ],
    function (module, Button, iconSet) {

        /**
         *
         */
        var Link = Button.extend({
            moduleId: module.id,
            cssClass: "j-link",

            register: {
                as: "link",
                accept: "Jet/Model/Action"
            },

            decl: {
                fields: [
                    {
                        name: "tag",
                        defaultValue: "a"
                    },
                    {
                        name: "model",
                        onUpdate: function (link) {
                            link.attributes.href = link.model.prop('link');
                        }
                    }
                ]
            },
            getInnerHTML: function () {
                return this.model.getText();
            }
        });

        return Link;

    }
);