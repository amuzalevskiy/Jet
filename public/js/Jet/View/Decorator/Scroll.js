define([
        'module',
        'tpl!Jet/IncludeInner',
        '../Decorator',
],

    function (module, templateDecoratorScroll, Decorator) {

        return Decorator.extend({

            moduleId: module.id,

            template: templateDecoratorScroll,

            decl: {
                fields: [
                    {
                        name: 'showHorScroll',
                        type: 'Boolean',
                        defaultValue: true
                    },
                    {
                        name: 'showVertScroll',
                        type: 'Boolean',
                        defaultValue: true
                    }
                ]
            },

            overflowX: 'hidden',

            overflowY: 'hidden',

            checkLayout: function (deep) {

                if (deep !== false)
                    this.eachConnectedView('checkLayout');

                this.inner.$el.css({ overflow: 'hidden' });

                var overflowX = (this.showHorScroll && this.el.clientWidth < this.inner.getTotalWidth()) ? 'scroll' : 'hidden',
                    overflowY = (this.showVertScroll && this.el.clientHeight < this.inner.getTotalHeight()) ? 'scroll' : 'hidden';

                if (this.overflowX !== overflowX || this.overflowY !== overflowY) {
                    this.overflowX = overflowX;
                    this.overflowY = overflowY;
                    this.$el.css({
                        overflowX: overflowX,
                        overflowY: overflowY
                    });

                    this.forseDomLayoutUpdate();
                }
                if (overflowX || overflowY) {
                    this.inner.$el.css({ overflow: 'visible' });
                }

            }
        });
    }
);