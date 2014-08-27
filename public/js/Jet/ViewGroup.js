/**
 * Allows to create a group of elements with similar style, 
 * wrap Html code
 * @todo add event listeners
 * 
 * Basic use case:
 *
 * template
 * <code>
 * <%= include(item, flyweight)) %>
 * <%= include(item2, flyweight)) %>
 * </code>
 * 
 * after this code will set width on both items
 * flyweight.setWidth(200);
 */

define([
        'module',
        './StdClass',
        'jquery',
        './Field/Html/CssProp',
        './Service/Stylesheet',
        './Template',
        './Field/KeyValueList'
    ], function (module, StdClass, $, CssPropField, Stylesheet, Template) {

        // Cached regex to split keys for `delegate`.
        var delegateEventSplitter = /^(\S+)\s*(.*)$/;

        var decl = {
            fields: [
                {
                    name: "template",
                    jet: "Object",
                    type: Template
                },

                {
                    name: "owner",
                    jet: "Object",
                    required: true,
                    autodestroy: true
                },

                {
                    name: "mainClass",
                    jet: "String",
                    defaultValue: function (model) {
                        return model.owner.id + '-item';
                    }
                },

                {
                    name: "itemClass",
                    jet: "TagList"
                },

                {
                    name: 'events',
                    jet: "KeyValueList",
                    onUpdate: function (group) {
                        var events = _.clone(group[this.name]),
                            cssClass = group.mainClass;
                        for (var key in events) {
                            var match = key.match(delegateEventSplitter);
                            var eventName = match[1], selector = match[2];
                            var fullKey = eventName + ' .' + cssClass + (selector === '' ? '' : ' ' + selector);
                            (function(fn){
                                group.owner.addEvent(
                                    fullKey,
                                    function (e) {
                                        var $currentTarget = $(e.currentTarget),
                                            view = ($currentTarget.hasClass(cssClass) ? $currentTarget : $currentTarget.parents('.' + cssClass))[0].jetView;
                                        fn.call(group, e, view);
                                    }
                                );
                            })(events[key]);
                        }
                    },
                    destroy: function (model) {
                        model.owner.undelegateEvents(model.mainClass);
                    }
                }
            ]
        };
        // add css properties
        // also will be stored in View.cssProps later
        var cssProps = [
            'width', 'height',
            'padding', 'margin', 'border',
            'outline',
            'cursor'
        ];

        for (var i = 0; i < cssProps.length; i++) {
            decl.fields.push(new CssPropField({
                name: cssProps[i],
                onUpdate: function (model) {
                    Stylesheet.addRule('.' + model.mainClass, model.css);
                }
            }));
        }
        return StdClass.extend({
            moduleId: module.id,
            decl: decl,

            for: function (view) {
                view.addCssClass(this.mainClass, this.itemClass);
                this.inner = view;
                return this;
            },

            /**
             * template for rendering
             *
             * @type {Template} obj which should have render() fn
             */
            template: null,

            /**
             * Returns full element HTML
             * @param id
             * @returns {*}
             */
            getOuterHTML: function () {
                if (!this.template) {
                    return this.inner.getOuterHTML();
                }

                // we don't create extra tag for each View in group
                // but it is possible to wrap html with some template
                this.view = this;
                return this.template.getInnerHTML(this);
            },

            destroy: function () {
                Stylesheet.removeRule('.' + this.mainClass);
                this.eachChild(function (child) {
                    child.removeCssClass(this.mainClass);
                }, this);
            },
            eachChild: function (fn, ctx) {
                this.owner.$('.' + this.mainClass).each(function () {
                    fn.call(ctx || this.jetView, this.jetView);
                });
            }
        });
    }
)