define(
    [
        'module',
        '../ViewBuilder'
    ],
    function (module, ViewBuilder) {
        return ViewBuilder.extend({
            moduleId: module.id
        });
    }
)