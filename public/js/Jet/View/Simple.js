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
                        name: "tag",
                        type: "String",
                        defaultValue: "div"
                    },
                    {
                        name: "cssClass",
                        jet: "TagList",
                        onUpdate: function (view) {
                            if (view.$el) {
                                // should support template provided class names
                                var cssClass = ((view.template && view.template.container && view.template.container.cssClass) ? ' ' + view.template.container.cssClass : '');
                                view[this.name] && (cssClass = view[this.name] + cssClass);
                                view.$el.attr('class', cssClass || "");
                            }
                        }
                    }
                ]
            },

            getInnerHTML: function () {
                return this.html;
            },

            getOuterHTML: function () {
                return "<" + this.tag + ' id="' + this.id + '"' + (this.cssClass ? (" class='" + this.cssClass + "'") : "") + ">" + this.html + "</" + this.tag + ">";
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