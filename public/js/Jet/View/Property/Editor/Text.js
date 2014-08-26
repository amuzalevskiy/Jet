define([
        'module',
        '../Editor'
],

    function (module, Field) {
        return Field.extend({
            moduleId: module.id,
            register: {
                as: "prop_edit",
                accept: 'Jet/Field/String'
            }
        });
    }
)