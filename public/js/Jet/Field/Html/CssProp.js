define(
    [
        'module',
        '../String'
    ],

    function (module, String) {

        return String.extend({
            moduleId: module.id,
            _get: function (model) {
                return (model.css || (model.css = {}))[this.name];
            },
            _set: function (model, value) {
                var css = model.css || (model.css = {});
                if (css[this.name] !== value) {
                    css[this.name] = value;
                    return true;
                }
            }
        });

    }
)