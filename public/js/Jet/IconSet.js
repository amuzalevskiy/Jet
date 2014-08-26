/**
 * Created by andrii.muzalevskyi on 24.08.2014.
 */
define(
    [
        './View/Icon'
    ],
    function (Icon) {

        return {
            get: function (name, className) {
                return new Icon({
                    name: name,
                    className: className
                });
            }
        };

    }
);