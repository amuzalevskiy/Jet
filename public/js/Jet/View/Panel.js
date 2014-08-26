define(
    [
        'module',
        './Wrapper',
        './Simple',
        '../View',
        '../Const',
        '../IconSet'
    ],
    function (module, Wrapper, SimpleView, View, Const, iconSet) {
        /**
         * Panel is just a window. It includes:
         *
         * - header
         * - Status bar
         * - pict buttons (close, collapse, etc.)
         * - buttton bar
         * - menu
         *
         * Most part of interface has Panel like realization
         */
        return Wrapper.extend({
            moduleId: module.id,
            decl: {
                fields: [
                    {
                        name: "title",
                        jet: "String"
                    },
                    {
                        name: "icon",
                        jet: "String"
                    },
                    {
                        name: "content",
                        jet: "Object",
                        type: Object
                    },
                    {
                        name: "header",
                        jet: "String",
                        defaultValue: 'auto'
                    },
                    {
                        name: "headerButtons",
                        jet: "TagList",
                        defaultValue: ""
                    },
                    {
                        name: "collapsible",
                        jet: "Boolean",
                        defaultValue: false
                    },
                    {
                        name: "collapsed",
                        jet: "Boolean",
                        defaultValue: false,
                        onUpdate: function (model) {
                            if (model.hasClassName('j-panel-collapsed')) {
                                (!model.collapsed) && model.removeClassName('j-panel-collapsed');
                            } else {
                                model.collapsed && model.addClassName('j-panel-collapsed')
                            }
                        }
                    }
                ]
            },
            initialize: function () {
                this.updateInner();
            },

            updateInner: function () {
                var inner = this.inner = new View.Collection({
                    className: "j-panel"
                });
                this.updateHeaderView();
                this.updateBodyView();
                if(this.hasHeader())
                    inner.push(this.headerView);
                inner.push(this.bodyView);
            },

            hasHeader: function () {
                return this.header !== 'auto' ? this.header == 'show' : (
                        this.getTitle() || this.getHeaderButtons()
                    );
            },

            updateHeaderView: function () {
                var panel = this;
                panel.headerView = new View.Collection({
                    className: "j-panel-header",
                    idScope: "j-panel-header-",
                    layout: Const.layout.horizontalRaw,
                    items: [
                        new SimpleView({
                            className: "j-panel-title",
                            html: this.getTitle()
                        }),
                        (panel.headerButtonsView = new View.Collection({
                            className: "j-header-buttons",
                            idScope: "j-header-buttons-"
                        }))
                    ]
                });
                if (panel.icon) {
                    panel.headerView.items.unshift(iconSet.get(panel.icon, "j-panel-header-icon"));
                    panel.headerView.addClassName('j-panel-header-with-icon');
                }
                panel.eachHeaderButton(function(icon){
                    panel.headerButtonsView.items.push(iconSet.get(icon, "j-header-button"));
                })
                if (panel.collapsible) {
                    panel.collapseButton = iconSet.get(panel.collapsed ? 'chevron-down' : 'chevron-up', "j-header-button");
                    panel.collapseButton.addEvent('click', function () {
                        panel.setCollapsed(!panel.collapsed);
                        panel.collapseButton.setName(panel.collapsed ? 'chevron-down' : 'chevron-up');
                        panel.collapseButton.render();
                    });
                    panel.headerButtonsView.items.push(this.collapseButton);
                }
                panel.headerButtonsView.group.addEvent('click', _.bind(panel.onHeaderButtonClick, panel));
            },

            updateBodyView: function () {
                var content = this.getContent();
                if (content)
                    this.bodyView = new SimpleView({
                        className: "j-panel-body j-panel-body-html",
                        html: this.getContent()
                    });
            },

            onHeaderButtonClick: function (e, icon) {
                this.trigger('header-button-click', e, icon);
            }
        });
    }
)
