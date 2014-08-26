define(
    [
        'module',
        './Wrapper'
    ],
    function (module, Wrapper) {

        return Wrapper.extend({

            moduleId: module.id

        });

    }
)