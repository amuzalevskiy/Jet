define(
    [
        'module',
        '../Jet',
        './String'
    ],

    function (parts, Jet, StringField) {

        var TagList = StringField.extend({
            /**
             * overrides
             */
            moduleId: parts.id,
            decl: {
                fields: [
                    {
                        name: "separator",
                        jet: "String",
                        defaultValue: ' '
                    }
                ]
            },
            addAccessorFns: function (protoProps, temporary) {
                var capName = this.getCapOneName(),
                    field = this;
                protoProps['add' + capName] = function () {
                    var parts = this[field.name]?this[field.name].split(field.separator):[],
                        changed = 0;
                    for (var i = 0; i < arguments.length; i++) {
                        var x = arguments[i];
                        if (!x) {
                            continue;
                        }
                        if (_.indexOf(parts, x) == -1) {
                            parts.push(x);
                            changed = 1;
                        }
                    }
                    if (changed) {
                        this[field.name] = parts.join(field.separator);

                        if (field.onUpdate) {
                            field.onUpdate(this);
                        }
                    }
                };
                protoProps['remove' + capName] = function (x) {
                    var parts = this[field.name]?this[field.name].split(field.separator):[],
                        changed = 0;
                    for (var i = 0; i < arguments.length; i++) {
                        var x = arguments[i];
                        if (!x) {
                            continue;
                        }
                        var index = _.indexOf(parts, x);
                        if (index != -1) {
                            parts.splice(index, 1);
                            changed = 1;
                        }
                    }
                    if (changed) {
                        this[field.name] = parts.join(field.separator);
                        if (field.onUpdate) {
                            field.onUpdate(this);
                        }
                    }
                }
                protoProps['each' + capName] = function (fn, context) {
                    var parts = this[field.name] ? this[field.name].split(field.separator) : [];
                    for (var i = 0; i < parts.length; i++) {
                        fn.call(context || this, parts[i]);
                    }
                }
                protoProps['has' + capName] = function (x) {
                    var parts = this[field.name] ? this[field.name].split(field.separator) : [],
                        index = _.indexOf(parts, x);
                    return index != -1;
                }
                StringField.prototype.addAccessorFns.call(this, protoProps, temporary);
            }
        });

        return TagList;

    }
)