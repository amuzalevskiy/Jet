/**
 * Created by andrii.muzalevskyi on 20.08.2014.
 */
define(
    [
    ],
    function () {

        /**
         *
         */
        return {
            normalize: function (name, normalize, parentMap) {
                return parentMap.id.replace(/\/\w*$/i,'');
            },

            load: function (name, req, onload, config) {
                req([name], function (value) {
                    onload(value);
                });
            }
        };

    }
);