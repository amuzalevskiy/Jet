define(['require', './SpecAll'], function(require, SpecAll) {
    return {
        describe: function (module, fn) {
            var needed = module.id.replace("Jet/tests/", "Jet/");
            require([needed, 'module'], function (neededObj, module) {
                describe(needed, function(){
                    fn(neededObj, module);
                });
                SpecAll.setLoaded(module.id);
            });
        }
    }
})