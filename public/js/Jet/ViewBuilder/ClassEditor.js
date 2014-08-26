define(
    [
        'module',
        '../ViewBuilder',
        '../Const',
        '../View',
        '../View/Decorator/Label'
    ],
    function (module, ViewBuilder, Const, View, DecoratorLabel) {
        return ViewBuilder.extend({
            moduleId: module.id,
            build: function (obj, options) {
                var list = new View.Collection({
                    layout: Const.layout.vertical
                });

                var properties = obj.getProperties();
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    list.add(
                        new DecoratorLabel({
                            inner: property.getView('edit')
                        })
                    );
                }

                return list;
            }
        });
    }
)