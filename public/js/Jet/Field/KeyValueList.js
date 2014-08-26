define(
    [
        'module',
        '../Jet',
        '../Field'
    ],

    function (module, Jet, Field) {

        var splice = Array.prototype.splice;

        var KeyValueList = Field.extend({
            /**
             * overrides
             */
            moduleId: module.id,
            addAccessorFns: function (protoProps, temporary) {
                var capName = this.getCapOneName(),
                    field = this;
                protoProps['add' + capName] = function (key, value) {
                    var list = this[field.name] || (this[field.name] = {});

                    if (list[key] !== value) {
                        list[key] = value;

                        if (field.onUpdate) {
                            field.onUpdate(this);
                        }
                    }
                };
                protoProps['remove' + capName] = function (key) {
                    var list = this[field.name] || (this[field.name] = {});
                    if (list[key]) {
                        delete list[key];

                        if (field.onUpdate) {
                            field.onUpdate(this);
                        }
                    }
                }
                protoProps['each' + capName] = function (fn) {
                    var isMethod = _.isString(fn);
                    var args = isMethod ? splice.call(arguments, 1) : undefined;
                    var list = this[field.name] || (this[field.name] = {});
                    for (var key in list) {
                        var item = list[key];
                        (isMethod ? item[fn].apply(item, args) : fn.call(this, item, key));
                    }
                }
                protoProps['get' + capName] = function (key) {
                    var list = this[field.name];
                    return list ? list[key] : undefined;
                }
                Field.prototype.addAccessorFns.call(this, protoProps, temporary);
            }
        });

        return KeyValueList;

    }
)