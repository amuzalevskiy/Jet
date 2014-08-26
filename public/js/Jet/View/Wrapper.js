define([
        'module',
        '../View'
],

    function (module, View) {

        var Wrapper = View.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "inner",
                        jet: "Object",
                        base: View
                    },
                    {
                        name: "useTemplate",
                        jet: "Boolean"
                    }
                ],
                final: true
            },

            setUseTemplate: function (value) {
                if (this.isRendered && value != this.addElement) {
                    if (value) {
                        this.setElement(this.inner.el);
                    } else {
                        this.inner.setElement(this.el);
                    }
                    this.update();
                }
                this.useTemplate = !!value;
            },

            render: function () {
                if (!this.useTemplate) {
                    return this.inner.render.apply(this.inner, arguments);
                }
                return View.prototype.render.apply(this, arguments);
            },

            setElement: function () {
                if (!this.useTemplate) {
                    this.inner.setElement.apply(this.inner, arguments);
                    this.el = this.inner.el;
                    this.$el = this.inner.$el;
                    return;
                }
                return View.prototype.setElement.apply(this, arguments);
            },

            focus: function () {
                this.inner.focus();
            },


            /**
             * returns html to place into this.el
             *
             * @param id identifier for root element
             */
            getInnerHTML: function (id) {
                if (!this.useTemplate) {
                    return this.inner.getInnerHTML.apply(this.inner, arguments);
                }
                return View.prototype.getInnerHTML.apply(this, arguments);
            },

            /**
             * Returns wrapper for innerHTML
             *
             * @param id
             * @returns {*}
             */
            getTag: function (id) {
                if (!this.useTemplate) {
                    return this.inner.getTag.apply(this.inner, arguments);
                }
                return View.prototype.getTag.apply(this, arguments);
            },

            /**
             * Returns full element HTML
             * @param id
             * @returns {*}
             */
            getOuterHTML: function (id) {
                if (!this.useTemplate) {
                    return this.inner.getOuterHTML.apply(this.inner, arguments);
                }
                return View.prototype.getOuterHTML.apply(this, arguments);
            }
        });

        return Wrapper;

    }
)