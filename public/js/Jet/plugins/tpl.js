// Define the TEMPLATE PLUG-IN.
// Thanks http://www.bennadel.com/blog/2285-writing-a-requirejs-plugin-to-load-remote-jquery-templates.htm
define(
    ['Jet/Template/Extended'],
    function(Template){

        var templates = {},
            mainConfig = {
                basePath: "js",
                themePath: "Jet/Theme/Clean"
            };

        // I load the given resource.
        var loadResource = function(
            resourceName,
            parentRequire,
            callback,
            config
            ){

            // Parse the resource - extract the path to the template
            // file and the class name of the script.
            var resourceConfig = parseResource( resourceName );

            // Get the path to the template file.
            var resourcePath = resourceConfig.resourcePath;

            // get the block name
            var blockName = resourceConfig.blockName;

            var template;

            // already loaded and parsed
            if (template = templates[resourcePath]) {
                callback( blockName ? template.block[blockName] : template );
                return;
            }

            // Load the template class.
            parentRequire(
                [
                    "text!" + mainConfig.themePath + "/" + resourcePath + ".html"
                ],
                function( templateContent ){
                    template = templates[resourcePath] = new Template({sourceURL: resourcePath, content: templateContent, uri: mainConfig.basePath + "/" + mainConfig.themePath + '/' + resourcePath});
                    callback( blockName ? template.block[blockName] : template );
                }
            );

        };


        // When the resource name is passed to this plugin, it is in
        // the form of:
        //
        // resourcePath:blockName
        //
        // ... where resourcePath is the path to the HTML file that
        // contains our templates and className is the class attribute
        // of the Script tag that contains our template markup.
        var parseResource = function( resourceName ){

            // Split the resource into parts.
            var resourceParts = resourceName.split( ":" );

            // Get the resource path to our HTML file.
            var resourcePath = resourceParts[ 0 ];

            // Get the class name of our template markup container.
            var blockName = resourceParts[ 1 ];

            // Return the resource configuration.
            return({
                resourcePath: resourcePath,
                blockName: blockName
            });

        };


        // --------------------------------------------------- //
        // --------------------------------------------------- //


        // Return the public API for the plugin. The only required
        // function in the plugin API is the load() function.
        return({
            load: loadResource,
            config: mainConfig
        });


    }
);