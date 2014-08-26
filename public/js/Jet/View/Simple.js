define(
    [
        'module',
        './../Jet',
        '../View'
    ],
    function (module, Jet, View) {
        return View.extend({
            moduleId: module.id,

            decl: {
                replaceParent: true,
                fields: [
                    {
                        name: "id",
                        type: "String",
                        defaultValue: function (model) {
                            return model.idScope + model.constructor.counter++;
                        }
                    },
                    {
                        name: "html",
                        jet: "Html"
                    },
                    {
                        name: "tagName",
                        type: "String",
                        defaultValue: "div"
                    },
                    {
                        name: "className",
                        jet: "TagList",
                        onUpdate: function (view) {
                            if (view.$el) {
                                // should support template provided class names
                                var className = ((view.template && view.template.container && view.template.container.className) ? ' ' + view.template.container.className : '');
                                view[this.name] && (className = view[this.name] + className);
                                view.$el.attr('class', className || "");
                            }
                        }
                    }
                ]
            },

            getInnerHTML: function () {
                return this.html;
            },

            getOuterHTML: function () {
                return "<" + this.tagName + ' id="' + this.id + '"' + (this.className ? (" class='" + this.className + "'") : "") + ">" + this.html + "</" + this.tagName + ">";
            },

            /**
             * support Jet.View.Extended functionality
             */
            remove: Jet.emptyFn,
            /**
             * Just add element link to be able use
             *
             * @param element
             */
            setElement: function (element) {
                var $el = element instanceof $ ? element : $(element);
                this.$el = $el;
                this.el = $el[0];
                this.el && (this.el.jetView = this);
            },
            afterDomCreate: Jet.emptyFn,
            checkLayout: Jet.emptyFn
        });
    }
)