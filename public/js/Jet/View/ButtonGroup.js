/**
 * Created by andrii.muzalevskyi on 23.08.2014.
 */
define(
    [
        'module',
        './Button'
    ],
    function (module, Button) {

        /**
         *
         */
        var ButtonGroup = Button.Collection.extend({
            moduleId: module.id,
            decl:{
                fields:[
                    {
                        name: "vertical",
                        jet: "Boolean",
                        onUpdate: function (model) {
                            model.removeCssClass('btn-group-vertical');
                            if (model.vertical) {
                                model.addCssClass('btn-group btn-group-vertical');
                            }
                        }
                    },
                    {
                        name: "collapse",
                        jet: "Boolean",
                        onUpdate: function (model) {
                            model.removeCssClass('btn-group');
                            if (model.collapse) {
                                model.addCssClass('btn-group');
                            }
                        }
                    }
                ]
            }
        });

        return ButtonGroup;

    }
);