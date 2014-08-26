define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function (module, Jet, Field) {

        /**
         * allows miltiline text|HTML
         *
         * default editors - rich or textarea
         */
        var HtmlField = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            type: 'text',

            parseJSON: function (value) {
                return value.toString();
            }
        });

        return HtmlField;

    }
)