/**
 * View
 *
 * Mostly follows Backbone.View
 *
 * Adds includes logic
 *
 */

define(
    [
        'module',
        './Jet',
        './StdClass',
        './Collection',
        './ViewGroup',
        './Const',
        './Impl/StdClassImpl',
        './Template',
        './View/Util/CssField',
        './Service/Stylesheet',
        'tpl!Jet/List',

        // just load cause View uses them
        './Field/TagList',
        './Field/KeyValueList'
    ],

    function (module, Jet, StdClass, Collection, ViewGroup, Const, StdClassImpl, Template, CssField, Stylesheet, templateList) {

        // Cached regex to split keys for `delegate`.
        var delegateEventSplitter = /^(\S+)\s*(.*)$/;

        var decl = {
            fields: [
                /**
                 * used to create id by default
                 */
                {
                    name: "idScope",
                    type: "String"
                },
                /**
                 * identifier of current view
                 */
                {
                    name: "id",
                    type: "String",
                    defaultValue: function (model) {
                        return model.idScope + model.constructor.counter++;
                    }
                },

                /**
                 * link to the parent view
                 */
                {
                    name: "owner",
                    type: "Object"
                },
                /**
                 * The html content of this view
                 */
                {
                    name: "html",
                    jet: "Html"
                },
                /**
                 * If html is not specified this template will be used to render view
                 */
                {
                    name: "template",
                    jet: "Object",
                    type: Template
                },
                /**
                 * View by default accept model here...
                 * Standard ViewBuilder pass model, so this is often used
                 */
                {
                    name: "model",
                    jet: "Object",
                    type: Object
                },
                /**
                 * Events in backbone format
                 * <code>
                 *      {
                 *          "click .subitem" : fn,
                 *          "click": fn
                 *      }
                 * </code>
                 *
                 * also available interface like
                 * view.addEvent("click .subitem", fn)
                 * view.removeEvent("click .subitem")
                 */
                {
                    name: 'events',
                    jet: "KeyValueList",
                    onUpdate: function (view) {
                        view.undelegateEvents();
                        view.delegateEvents();
                    }
                },

                /**
                 * stores all views included to this page
                 */
                {
                    name: 'includes',
                    jet: "KeyValueList"
                },

                /**
                 * tag of element to create
                 */
                {
                    name: "tag",
                    type: "String",
                    defaultValue: "div"
                },
                /**
                 * element attributes
                 */
                {
                    name: "attributes",
                    jet: "Object",
                    type: Object,
                    defaultValue: function () {return {}}
                },
                /**
                 * Specifies if current element is draggable
                 */
                {
                    name: "draggable",
                    type: "Boolean",
                    defaultValue: false,
                    depend: "attributes",
                    onUpdate: function (view) {
                        if(view.draggable) {
                            view.attributes.draggable = "true";
                            view.$el && view.$el.attr(view.attributes);
                            view.addEvent('dragstart', function (e) {
                                View.transferView = view;
                                view.trigger('dragstart', e);
                            });
                            view.addEvent('dragend', function (e) {
                                if (View.transferView)
                                    delete View.transferView;
                                view.trigger('dragend', e);
                            });
                        } else {
                            if (view.attributes.draggable) {
                                delete view.attributes.draggable;
                                view.$el && view.$el.attr(view.attributes);
                                view.removeEvent('dragstart');
                                view.removeEvent('dragend');
                            }
                        }
                    }
                },
                /**
                 *
                 */
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
        };

        // add css properties
        // also will be stored in View.cssProps later
        var cssProps = [
            'width', 'height',
            'padding', 'margin', 'border',
            'outline',
            'cursor',
            'overflow', 'overflowX', 'overflowY'
        ];

        for (var i = 0; i < cssProps.length; i++) {
            decl.fields.push(new CssField({
                name: cssProps[i]
            }));
        }

        var View = StdClass.extend({
            moduleId: module.id,
            decl: decl,

            constructor: function (options) {
                !options && (options = {});
                this.parse(options);
                this.initialize();
            },

            /**
             * scope to generate ids
             * @see View[id].defaultValue
             */
            idScope: 'j-view-',

            // jQuery delegate for element lookup, scoped to DOM elements within the
            // current view. This should be prefered to global lookups where possible.
            $: function(selector) {
                return this.$el.find(selector);
            },

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize: function(){},

            /**
             * template for rendering
             *
             * @type {Template} obj which should have render() fn
             */
            template: null,

            /**
             * Returns html to place into this.el.
             * Specify template or override in child classes
             */
            getInnerHTML: function (update) {
                if (!update && this.el)
                    return this.el.innerHTML;
                // if we have html just return it
                if (this.html !== undefined) {
                    return this.html;
                }
                // or render view with template
                if (this.template == undefined) {
                    throw new Error("No template specified for <" + this.moduleId + ">");
                }
                this.view = this; // for templates
                return this.template.getInnerHTML(this);
            },

            /**
             * creates tag for this
             */
            createOpenTag: function (close) {
                var attributes = _.extend({}, this.extractObj(this.attributes), { id: this.id, class: this.getCssClass() });
                var res = ['<' + this.tag + ' '];
                if (this.css) {
                    attributes.style = Stylesheet.cssPropsToString(this.css);
                }
                for (var name in attributes) {
                    if (attributes[name] !== undefined) {
                        res.push(name + '="' + attributes[name].toString().replace(/"/g, '&#34;') + '"');
                    }
                }
                res.push('>');
                close !== false && res.push('</' + this.tag + '>');
                return res.join('');
            },

            /**
             * Returns close tag for view html code
             */
            createCloseTag: function () {
                return '</' + this.tag + '>';
            },

            /**
             * Returns full element HTML
             * @param id
             * @returns {*}
             */
            getOuterHTML: function (update) {
                if (!update && this.el)
                    return this.el.outerHTML;
                Jet.pushContext(this);
                var res = this.createOpenTag(false) + this.getInnerHTML() + this.createCloseTag();
                Jet.popContext();
                return res;
            },

            /**
             * Renders view to Dom Element
             *
             * @param el
             * @param position one of
             * - 'beforebegin' Before the element itself.
             * - 'afterbegin' Just inside the element, before its first child.
             * - 'beforeend' - Just inside the element, after its last child.
             * - 'afterend' - After the element itself.
             */
            insertTo: function (el, position) {
                el = el.length ? el[0] : el;
                !position && (position = "beforeend");
                el.insertAdjacentHTML(position, this.getOuterHTML());
                var mineEl;
                switch (position) {
                    case "beforeend": // most common case first
                        mineEl = el.lastChild;
                        break;
                    case "afterend":
                        mineEl = el.nextSibling;
                        break;
                    case "afterbegin":
                        mineEl = el.firstChild;
                        break;
                    case "beforebegin":
                        mineEl = el.previousSibling;
                }
                this.setElement(mineEl);
                this.render(false);
            },

            replace: function (el) {
                this.insertTo(el, "afterend");
                $(el).remove();
            },

            /**
             * Updates view completely
             */
            render: function (domUpdated) {
                if (!this.el) {
                    return;
                }
                if (domUpdated !== false) {
                    this.removeIncludes();
                    this.undelegateEvents();
                    this.el.innerHTML = this.getInnerHTML(true);
                }
                this.$el = $(this.el);
                this.afterDomCreate();
                this.checkLayout();
            },

            // Change the view's element (`this.el` property), including event
            // re-delegation.
            setElement: function(element, connect) {
                if (this.el == element || ((element instanceof $) && this.el == element[0])) {
                    return;
                }
                if (this.el) this.remove();
                var $el = element instanceof $ ? element : $(element);
                this.$el = $el;
                this.el = $el[0];
                this.el.jetView = this;

                if (connect !== false) {
                    this.afterDomCreate();
                }
                return this;
            },

            // Set callbacks, where `this.events` is a hash of
            //
            // *{"event selector": "callback"}*
            //
            //     {
            //       'mousedown .title':  'edit',
            //       'click .button':     'save'
            //       'click .open':       function(e) { ... }
            //     }
            //
            // pairs. Callbacks will be bound to the view, with `this` set properly.
            // Uses event delegation for efficiency.
            // Omitting the selector binds the event to `this.el`.
            // This only works for delegate-able events: not `focus`, `blur`, and
            // not `change`, `submit`, and `reset` in Internet Explorer.
            delegateEvents: function (events, cssClass) {
                if (!this.el) {
                    return;
                }
                if (!(events || (events = this.events))) return this;
                var group = cssClass ? cssClass : this.id;
                for (var key in events) {
                    var method = events[key];
                    if (!_.isFunction(method)) method = this[events[key]];
                    if (!method) continue;

                    var match = key.match(delegateEventSplitter);
                    var eventName = match[1], selector = (cssClass ? '.' + cssClass + ' ' : '') + match[2];
                    method = _.bind(method, this);
                    eventName += '.dE-' + group;
                    if (selector === '') {
                        this.$el.on(eventName, method);
                    } else {
                        this.$el.on(eventName, selector, method);
                    }
                }
                return this;
            },

            // Clears all callbacks previously bound to the view with `delegateEvents`.
            // You usually don't need to use this, but may wish to if you have multiple
            // Backbone views attached to the same DOM element.
            undelegateEvents: function (cssClass) {
                if (!this.$el)
                    return;
                this.$el.off('.dE-' + (cssClass || this.id));
                return this;
            },

            removeIncludes: function () {
            this.eachInclude('remove');
                this.includes = {};
            },

            remove: function () {
                if (!this.el) {
                    return;
                }
                this.el.jetView = undefined;
                this.removeIncludes();
                this.undelegateEvents();
                this.$el.remove();
                delete this.$el;
                delete this.el;
            },

            afterDomCreate: function () {
                this.delegateEvents();
                this.ensureIncludes();
            },

            checkLayout: function (deep) {
                if (deep !== false)
                    this.eachInclude('checkLayout');
            },

            /**
             * Connects all includes to dom
             */
            ensureIncludes: function () {
                this.eachInclude(function (view) {
                    view.setElement(document.getElementById(view.id));
                });
            },

            toString: function (context) {
                !context && (context = Jet.getContext());
                this.setOwner(context);
                if (context) {
                    context.addInclude(this.id, this);
                    // if context has itemGroup - render using it
                    if (context.itemGroup && !this.groupRenderStarted) {
                        // avoid endless cycle
                        this.groupRenderStarted = true;
                        return context.itemGroup.for(this).getOuterHTML();
                        this.groupRenderStarted = false;
                    }
                }
                return this.getOuterHTML();
            },

            destroy: function () {
                this.remove();
                StdClass.prototype.destroy.call(this);
            },

            forseDomLayoutUpdate: function () {
                if (!this.el) return;
                var old = this.el.style.display;
                this.el.style.display = 'none';
                this.el.offsetHeight; // no need to store this anywhere, the reference is enough
                this.el.style.display = old;
            },

            getTotalWidth: function () {
                var el = this.el;
                return el.scrollWidth + el.offsetWidth - el.clientWidth;
            },

            getTotalHeight: function () {
                var el = this.el;
                return el.scrollHeight + el.offsetHeight - el.clientHeight;
            },

            triggerOnIncludes: function () {
                var args = arguments,
                    trigger;
                this.eachInclude(function (view) {
                    view.trigger.apply(view, args);
                    view.triggerOnIncludes(view, args);
                });
            },
            createDragPlaceholder: function () {
                // default browser behaviour
                // not supported yet =(
                return;
            },
            createDropPlaceholder: function (view, place, isHorizontal) {
                return new View({
                    html: "",
                    cssClass: "j-drop-placeholder j-drop-placeholder-default",
                    attributes: {
                        style: "height:" + (isHorizontal ? 4 : view.el.offsetHeight) + "px;width:" + (!isHorizontal ? 4 : view.el.offsetWidth) + "px"
                    }
                });
            },
            /**
             * getView('view') must return view itself
             *
             * @param name
             * @param options
             */
            getView: function (name, options) {
                if (name == 'view') {
                    // @todo decide if it must ignore options
                    return this;
                }
                StdClass.prototype.getView.call(this, name, options);
            },

            /**
             * Must return dropType allowed for dragged view.
             *
             * @param e {$.Event}
             * @param view {View}
             * @return {String|undefined} one of dropTypes allowed (copy|link|move)
             */
            dropFilter: function (e, view) {

            },

            // must be overridden to provide behaviour
            dropCopy: function (view) {},
            dropLink: function (view) {},
            dropMove: function (view) {}
        }, {
            cssProps: cssProps,
            counter: 0,
            delegateEventSplitter: delegateEventSplitter
        });

        View.extend = function (protoProps, staticProps) {
            !staticProps && (staticProps = {});

            // define idScope by moduleId, reverse for better reading, remove "Jet/View" prefix
            !protoProps.viewCssClass && (protoProps.viewCssClass = 'j-' + View.scope.removeFromModuleId(protoProps.moduleId).split('/').reverse().join('-').toLowerCase());
            protoProps.idScope = protoProps.viewCssClass + '-';
            protoProps.cssClass = (protoProps.cssClass ? (protoProps.cssClass + " ") : '') + protoProps.viewCssClass;

            // counter of views by type, just to don't see smth like j-view-102889
            staticProps.counter = 1;

            // basic extention
            var ext = StdClass.extend.call(this, protoProps, staticProps);
            ext.extend = View.extend;

            // register in base theme if defined
            if (protoProps.register) {
                var cfg = {}, register = protoProps.register;
                cfg[register.as] = { viewClass: ext };
                Jet.baseTheme.addBuilders(register.accept, cfg);

                // register collection as view for viewClass/Collection
                var cfg = {};
                cfg[register.as] = {
                    modelParameter: "items", // ViewBuilder/Collection
                    viewClass: ext.Collection
                };
                Jet.baseTheme.addBuilders(register.accept + "/Collection", cfg);

            }

            return ext;
        };

        var collectionFields = [];

        // copy collection fields
        collectionFields.push.apply(collectionFields, Collection.getDecl().initOptions.fields);

        // add View.Collection fields
        collectionFields.push.apply(collectionFields, [
            // preset itemConstructor
            {
                name: "itemConstructor",
                defaultValue: View
            },

            // Collection already have items field
            // so extend it with View.Collection properties
            _.extend({}, Collection.getDecl().fields.findByName("items").initOptions, {
                name: "items",
                onUpdate: function (list) {
                    list.on("add", function (view, at) {
                        if (list.itemGroup.template) {
                            // @todo remove this case, have a problems with wrapping html...
                            // need to store outerEl in view but this gives one more document.getElementById search...
                            // or traversing parents, what can be faster
                            // also it required only for const.layout.horizontal in basc configuration
                            list.render();
                            return;
                        }
                        if (list.el) {
                            if (list.length == 1) {
                                // first item added
                                view.insertTo(list.el, 'afterbegin', list.itemGroup);
                            } else {
                                if (at == 0) {
                                    view.insertTo(list.el.childNodes[0], 'beforebegin', list.itemGroup);
                                } else {
                                    view.insertTo(list.el.childNodes[at - 1], 'afterend', list.itemGroup);
                                }
                            }
                        }
                    });
                    list.on("remove", function (model, at) {
                        // remove model from dom
                        // nothing else needed
                        model.remove();
                    });
                    list.on("reset", list.render);
                }
            }),
            {
                name: "itemGroup",
                jet: "Object",
                type: ViewGroup,
                defaultValue: function (view) {
                    var itemGroup = new ViewGroup({
                        owner: view
                    });
                    return itemGroup;
                }
            },
            {
                name: "layout",
                jet: "Int",
                defaultValue: Const.layout.none,
                allowedValues: [
                    Const.layout.vertical, Const.layout.horizontal, Const.layout.flow
                ],
                depend: "itemGroup",
                _set: function (model, value) {
                    this._setNative(model, value);
                    model.itemGroup.removeItemClass('j-l-vertical j-l-horizontal j-l-flow j-l-flow-right');
                    switch (value) {
                        case Const.layout.v:
                            model.itemGroup.addItemClass('j-l-vertical');
                            break;
                        case Const.layout.vraw:
                            model.itemGroup.addItemClass('j-l-vertical-raw');
                            break;
                        case Const.layout.h:
                            // required as real height could be different,
                            // but display: table-cell will set exact height on elements
                            model.itemGroup.setTemplate(templateList.block.horizontalLayoutWrapper);
                            break;
                        case Const.layout.hraw:
                            model.itemGroup.addItemClass('j-l-horizontal');
                            break;
                        case Const.layout.flow:
                            model.itemGroup.addItemClass('j-l-flow');
                            break;
                        case Const.layout.flowRight:
                            model.itemGroup.addItemClass('j-l-flow-right');
                            break;
                    }
                }
            },
            {
                name: "sortable",
                type: "Boolean",
                onUpdate: function (list) {
                    if (list.sortable) {
                        list.each(function (item) {
                            item.setDraggable(true);
                        });
                        list.addEvent('dragleave', function (e) {
                            var rect = list.el.getBoundingClientRect(),
                                originalEvent = e.originalEvent;
                            if (
                                e.target == list.el
                                || originalEvent.clientX > rect.right
                                || originalEvent.clientX < rect.left
                                || originalEvent.clientY > rect.bottom
                                || originalEvent.clientY < rect.top
                                ) {
                                list._dropPlaceholder && this._dropPlaceholder.remove();
                            }
                        });

                        list.addEvent('dragover', function (e) {
                            var draggedItem = View.transferView;
                            if (!draggedItem)
                                return;
                            if (!list.indexOf(draggedItem) == -1) {
                                // it is not mine
                                return;
                            }

                            var cssClass = list.itemGroup.mainClass,
                                $target = $(e.target),
                                viewEl = ($target.hasClass(cssClass) ? $target : $target.parents('.' + cssClass))[0],
                                view = viewEl ? viewEl.jetView : false;

                            if (!view) {
                                if (list._dropPlaceholder) {
                                    // already selected where it will drop
                                    // so allow drop
                                    e.preventDefault();
                                }
                                // it's not over some child
                                // it's just over container
                                return;
                            }

                            // allow drop
                            e.preventDefault();

                            // we will move element within itself
                            e.originalEvent.dataTransfer.dropEffect = 'move';

                            // vertical or horizontal placeholder
                            // this matches raw/vertical layouts
                            var isHorizontal = (list.layout < 2),
                                viewOffset = view.$el.offset(),
                            // placeholder before or after element
                                place = isHorizontal
                                    ? (e.originalEvent.pageY < (viewOffset.top + view.el.offsetHeight / 2))
                                    : (e.originalEvent.pageX < (viewOffset.left + view.el.offsetWidth / 2));

                            if (view == draggedItem) {
                                delete list._dropPosition;
                                list._dropPlaceholder && this._dropPlaceholder.remove();
                                return;
                            }

                            if( list.indexOf(draggedItem) == list.indexOf(view) + (place ? -1 : 1) ) {
                                // at the same position
                                place = !place;
                            }

                            var placeholderChange = !list._dropPlaceholder || view.$el[place?'prev':'next']()[0] !== list._dropPlaceholder[0];

                            if (placeholderChange) {
                                list._dropPlaceholder && this._dropPlaceholder.remove();
                                list._dropPlaceholder = $(list.itemGroup.for(draggedItem.createDropPlaceholder(view, place, isHorizontal)).getOuterHTML());

                                var applyEl = (list.itemGroup.template) ? view.$el.parent() : view.$el;
                                applyEl[place ? 'before' : 'after'](list._dropPlaceholder);
                            }

                            list._dropPosition = {
                                place: place,
                                view: view
                            };
                        });
                        list.addEvent('drop', function (e) {
                            // already able to drop, please look at the specification
                            var draggedItem = View.transferView;
                            this._dropPlaceholder && this._dropPlaceholder.remove();
                            if (!list.indexOf(draggedItem) == -1) {
                                // it is not mine
                                return;
                            }
                            if(!list._dropPosition) {
                                return;
                            }
                            list.remove(draggedItem);
                            list.add(draggedItem, {
                                at: this.items.indexOf(list._dropPosition.view) + (list._dropPosition.place ? 0 : 1)
                            });
                        });

                    }else{
                        list.each(function (item) {
                            item.setDraggable(false);
                        });
                        // @todo remove callbacks
                    }
                }
            }
        ]);

        // grab all collection methods and properties
        var collectionProto = _.extend({}, Collection.prototype.constructor.__super__, Collection.prototype, {
            template: templateList.block.list,
            decl: {
                fields: collectionFields
            },
            // Collection should accept models and silently translate them into views
            _prepareModel: function(attrs) {
                if (attrs instanceof this.itemConstructor) {
                    return attrs;
                }
                if (attrs instanceof StdClassImpl) {
                    return new this.itemConstructor({
                        model: attrs
                    });
                }
                return this.itemConstructor.fromJSON(attrs);
            }
        });

        // avoid endless recursion
        var staticProps = {Collection: "recursion"};

        View.Collection = View.extend(collectionProto, staticProps);

        var isRecursive = false;

        View.Collection.extend = function (protoProps, staticProps) {
            !staticProps && (staticProps = {});
            // avoid endless recursion
            // create only one sub collection
            // this allow create compound elements based on View.Collection
            // <code>Button === View.Collection({
            //   cssClass: "btn",
            //   layout: Const.layout.horizontal,
            //   items: [
            //     new Icon(),
            //     new TextView()
            //   ]
            // }</code>
            if (isRecursive)
                staticProps = {Collection: "recursion"};
            isRecursive = true;
            var ext = View.extend.call(this, protoProps, staticProps);
            isRecursive = false;
            return ext;
        }

        return View;
    }
);