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
        'tpl!Jet/List',

        // just load cause View uses them
        './Field/TagList',
        './Field/KeyValueList'
    ],

    function (module, Jet, StdClass, Collection, ViewGroup, Const, StdClassImpl, Template, CssField, templateList) {

        // Cached regex to split keys for `delegate`.
        var delegateEventSplitter = /^(\S+)\s*(.*)$/;

        var decl = {
            fields: [
                {
                    name: "idScope",
                    type: "String"
                },
                {
                    name: "id",
                    type: "String",
                    defaultValue: function (model) {
                        return model.idScope + model.constructor.counter++;
                    }
                },
                {
                    name: "template",
                    jet: "Object",
                    type: Template
                },
                {
                    name: "html",
                    jet: "Html"
                },
                {
                    name: "model",
                    jet: "Object",
                    type: Object
                },
                {
                    name: 'events',
                    jet: "KeyValueList",
                    onUpdate: function (view) {
                        view.undelegateEvents();
                        view.delegateEvents();
                    }
                },

                /**
                 * use this field in templates like
                 * <code><%= include('header') %>
                 */
                {
                    name: 'includes',
                    jet: "KeyValueList"
                },
                {
                    name: 'connectedViews',
                    jet: "KeyValueList"
                },
                {
                    name: "tagName",
                    type: "String",
                    defaultValue: "div"
                },
                {
                    name: "allowScroll",
                    type: "String"
                },
                {
                    name: "attributes",
                    jet: "Object",
                    type: Object,
                    defaultValue: function () {return {}}
                },
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
             * if view is included into another, link to owner view will be here
             */
            owner: null,

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
            getInnerHTML: function () {
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
            getTag: function (close) {
                var attributes = _.extend({}, this.extractObj(this.attributes), { id: this.id, class: this.getClassName() });
                var res = ['<' + this.tagName + ' '];
                for (var name in attributes) {
                    res.push(name + '="' + attributes[name].toString().replace(/"/g, '&#34;') + '"');
                }
                res.push('>');
                close !== false && res.push('</' + this.tagName + '>');
                return res.join('');
            },

            /**
             * Returns close tag for view html code
             */
            getCloseTag: function () {
                return '</' + this.tagName + '>';
            },

            /**
             * Returns full element HTML
             * @param id
             * @returns {*}
             */
            getOuterHTML: function () {
                return this.getTag(false) + this.getInnerHTML() + this.getCloseTag();
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
            renderTo: function (el, position) {
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
                this.renderTo(el, "afterend");
                $(el).remove();
            },

            /**
             * Updates view completely
             */
            render: function (remove) {
                if (!this.el) {
                    return;
                }
                (remove !== false) && this.removeIncludes();
                this.undelegateEvents();
                this.el.innerHTML = this.getInnerHTML();
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

                this.css && $el.css(this.css);

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
            delegateEvents: function (events, className) {
                if (!this.el) {
                    return;
                }
                if (!(events || (events = this.events))) return this;
                var group = className ? className : this.id;
                for (var key in events) {
                    var method = events[key];
                    if (!_.isFunction(method)) method = this[events[key]];
                    if (!method) continue;

                    var match = key.match(delegateEventSplitter);
                    var eventName = match[1], selector = (className ? '.' + className + ' ' : '') + match[2];
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
            undelegateEvents: function (className) {
                if (!this.$el)
                    return;
                this.$el.off('.dE-' + (className || this.id));
                return this;
            },

            removeIncludes: function () {
                this.eachConnectedView('remove');
                this.connected = {};
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
                    this.eachConnectedView('checkLayout');
            },

            /**
             * Connects all includes to dom
             */
            ensureIncludes: function () {
                this.eachConnectedView(function (view) {
                    view.setElement(document.getElementById(view.id));
                });
            },

            include: function (view, group) {
                if (_.isString(view))
                    view = this.getInclude(view);
                this.addConnectedView(view.id, view);
                view.owner = this;
                return (group ? group.for(view) : view).getOuterHTML();
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

            triggerOnConnectedViews: function () {
                var args = arguments,
                    trigger;
                this.eachConnectedView(function (view) {
                    view.trigger.apply(view, args);
                    view.triggerOnConnectedViews(view, args);
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
                    className: "j-drop-placeholder j-drop-placeholder-default",
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
            !protoProps.viewClassName && (protoProps.viewClassName = 'j-' + View.scope.removeFromModuleId(protoProps.moduleId).split('/').reverse().join('-').toLowerCase());
            protoProps.idScope = protoProps.viewClassName + '-';
            protoProps.className = (protoProps.className ? (protoProps.className + " ") : '') + protoProps.viewClassName;

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
                    list.on("add", function (model, at) {
                        list.render();
                    });
                    list.on("remove", function (model, at) {
                        list.render();
                    });
                    list.on("reset", list.render);
                }
            }),
            {
                name: "group",
                jet: "Object",
                type: ViewGroup,
                defaultValue: function (view) {
                    var group = new ViewGroup({
                        owner: view
                    });
                    return group;
                }
            },
            {
                name: "layout",
                jet: "Int",
                defaultValue: Const.layout.none,
                allowedValues: [
                    Const.layout.vertical, Const.layout.horizontal, Const.layout.flow
                ],
                depend: "group",
                _set: function (model, value) {
                    this._setNative(model, value);
                    model.group.removeItemClass('j-l-vertical j-l-horizontal j-l-flow j-l-flow-right');
                    switch (value) {
                        case Const.layout.v:
                            model.group.addItemClass('j-l-vertical');
                            break;
                        case Const.layout.vraw:
                            model.group.addItemClass('j-l-vertical-raw');
                            break;
                        case Const.layout.h:
                            // required as real height could be different,
                            // but display: table-cell will set exact height on elements
                            model.group.setTemplate(templateList.block.horizontalLayoutWrapper);
                            break;
                        case Const.layout.hraw:
                            model.group.addItemClass('j-l-horizontal');
                            break;
                        case Const.layout.flow:
                            model.group.addItemClass('j-l-flow');
                            break;
                        case Const.layout.flowRight:
                            model.group.addItemClass('j-l-flow-right');
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

                            var className = list.group.mainClass,
                                $target = $(e.target),
                                viewEl = ($target.hasClass(className) ? $target : $target.parents('.' + className))[0],
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
                                list._dropPlaceholder = $(list.group.for(draggedItem.createDropPlaceholder(view, place, isHorizontal)).getOuterHTML());

                                var applyEl = (list.group.template) ? view.$el.parent() : view.$el;
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
            //   className: "btn",
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