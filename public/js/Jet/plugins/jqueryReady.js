// waits for domReady event
define(
    ['jquery'],
    function ($) {
        // Return the public API for the plugin. The only required
        // function in the plugin API is the load() function.
        return ({
            load: function (
                resourceName,
                parentRequire,
                callback,
                config
            ) {
                // wait for domReady event then pass jQuery
                $(function () {
                    callback($);
                })
            },
            write: function (pluginName, moduleName, write) {
                if (moduleName in buildMap) {
                    write("$(function(){define('" + pluginName + "!', function () { return $})});\n");
                }
            }
        });
    }
);