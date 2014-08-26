/**
 * Created by andrii.muzalevskyi on 23.08.2014.
 */
define(
    [
        'module',
        '../View',
        '../Const',
        '../IconSet',
        '../Model/Action'
    ],
    function (module, View, Const, iconSet, Action) {

        /**
         * Creates button in the interface
         */
        var Button = View.Collection.extend({
            viewClassName: "btn",
            moduleId: module.id,

            register: {
                as: "view",
                accept: "Jet/Model/Action"
            },

            decl: {
                fields: [
                    {
                        name: "layout",
                        defaultValue: Const.layout.horizontalRaw
                    },
                    {
                        name: "model",
                        jet: "Object",
                        type: Action,
                        defaultValue: function (button, options) {
                            // try parse options if model is not set
                            return new Action(options);
                        },
                        onUpdate: function (button) {
                            button.removeClassName("j-button-has-icon j-button-has-text");
                            button.reset([]);
                            if (button.model.getIcon()) {
                                button.addClassName("j-button-has-icon");
                                button.push(iconSet.get(button.model.getIcon(), "j-button-icon"));
                            }
                            if (button.model.getText()) {
                                button.addClassName("j-button-has-text");
                                button.push({html: button.model.getText()});
                            }
                        }
                    }
                ]
            },
            events: {
                "click": "onClick"
            },
            onClick: function (e) {
                e.preventDefault();
                if (this.disabled) return;
                var callback = this.model.getCallback();
                if (callback) {
                    return callback.call(this.model.getContext() || this, e);
                }
                var link = this.model.getLink();
                if (link) {
                    document.location = link;
                }
            }
        });

        return Button;

    }
);