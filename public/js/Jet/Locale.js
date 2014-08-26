define(
    [
        'underscore'
    ],
    function (_) {

        /**
         * Locale support
         */
        var Locale = function () {
        };

        Locale.prototype = {
            formatNumber: function (number) {
                return (new Number(number)).toString();
            },
            formatDate: function (date) {
                return (new Date(date)).toString();
            },
            getEmptyValueText: function () {
                return "&lt;Empty&gt;";
            }
        };
        return Locale;
    }
);