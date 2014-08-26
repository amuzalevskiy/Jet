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
                            model.removeClassName('btn-group-vertical');
                            if (model.vertical) {
                                model.addClassName('btn-group btn-group-vertical');
                            }
                        }
                    },
                    {
                        name: "collapse",
                        jet: "Boolean",
                        onUpdate: function (model) {
                            model.removeClassName('btn-group');
                            if (model.collapse) {
                                model.addClassName('btn-group');
                            }
                        }
                    }
                ]
            }
        });

        return ButtonGroup;

    }
);