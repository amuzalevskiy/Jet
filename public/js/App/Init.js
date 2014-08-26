/*

 Init.js
 --------------
 */
var App = {};
App.path = '/js/App';
App.themePath = "/js/Jet/Theme/Clean";
require.config({

    // Sets the js folder as the base directory for all future relative paths
    baseUrl: "./js",

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
    // probably a good idea to keep version numbers in the file names for updates checking
    paths: {

        // Core Libraries
        // --------------
        "jquery": "libs/jquery",
        "underscore": "libs/lodash",
        "backbone": "libs/backbone",

        // Plugins
        // -------
        "backbone.validateAll": "libs/Backbone.validateAll",
        "backbone.TreeModel": "libs/Backbone.TreeModel",
        "nicEditor": "libs/nicEditor",

        "text": "libs/plugins/text",
        "tpl": "Jet/plugins/tpl",
        "jqueryReady": "Jet/plugins/jqueryReady"
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {

        // Backbone
        "backbone": {

            // Depends on underscore/lodash and jQuery
            "deps": ["underscore", "jquery"],

            // Exports the global window.Backbone object
            "exports": "Backbone"

        },

        "libs/jquery.numeric": {"deps": ["jquery"]},
        "libs/bootstrap-datepicker": {"deps": ["jquery"]},

        "nicEditor": {
            exports: "nicEditor"
        },

        // Backbone plugins depends on Backbone
        "backbone.validateAll": ["backbone"],
        "backbone.TreeModel": ["backbone"]

    }

});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["Jet/Init", "Jet/tests/UiComponents", "jquery"],

    function (Jet, UiComponents) {
        document.body.innerHTML = "";
        UiComponents.addAll($(document.body));
    }
);