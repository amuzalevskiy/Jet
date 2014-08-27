define(
    [
        'module',
        './Wrapper',
        './Simple',
        '../View',
        '../Const',
        '../IconSet',
        'tpl!Jet/Panel'
    ],
    function (module, Wrapper, SimpleView, View, Const, iconSet, templatePanel) {
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
        return View.extend({
            moduleId: module.id,
            template: templatePanel,
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
                        name: "iconView",
                        _get: function (panel) {
                            return iconSet.get(panel.icon);
                        }
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
                            if (model.hasCssClass('j-panel-collapsed')) {
                                (!model.collapsed) && model.removeCssClass('j-panel-collapsed');
                            } else {
                                model.collapsed && model.addCssClass('j-panel-collapsed')
                            }
                        }
                    },
                    {
                        name: "bodyView",
                        _get: function (panel) {
                            return new SimpleView({
                                cssClass: "j-panel-body j-panel-body-html",
                                html: panel.getContent() || ""
                            });
                        }
                    },
                    {
                        name: "headerView",
                        _get: function (panel) {
                            var headerButtonsView,
                                headerView = new View.Collection({
                                cssClass: "j-panel-header",
                                idScope: "j-panel-header-",
                                layout: Const.layout.horizontalRaw,
                                items: [
                                    new SimpleView({
                                        cssClass: "j-panel-title",
                                        html: panel.getTitle()
                                    }),
                                    (headerButtonsView = new View.Collection({
                                        cssClass: "j-header-buttons",
                                        idScope: "j-header-buttons-"
                                    }))
                                ]
                            });
                            if (panel.icon) {
                                headerView.items.unshift(iconSet.get(panel.icon, "j-panel-header-icon"));
                                headerView.addCssClass('j-panel-header-with-icon');
                            }
                            panel.eachHeaderButton(function(icon){
                                headerButtonsView.items.push(iconSet.get(icon, "j-header-button"));
                            });

                            if (panel.collapsible) {
                                panel.collapseButton = iconSet.get(panel.collapsed ? 'chevron-down' : 'chevron-up', "j-header-button");
                                panel.collapseButton.addEvent('click', function () {
                                    panel.setCollapsed(!panel.collapsed);
                                    panel.collapseButton.setName(panel.collapsed ? 'chevron-down' : 'chevron-up');
                                    panel.collapseButton.render();
                                });
                                headerButtonsView.items.push(panel.collapseButton);
                            }
                            headerButtonsView.itemGroup.addEvent('click', _.bind(panel.onHeaderButtonClick, panel));
                            return headerView;
                        }
                    }
                ]
            },

            hasHeader: function () {
                return this.header !== 'auto' ? this.header == 'show' : (
                        this.getTitle() || this.getHeaderButtons()
                    );
            },

            onHeaderButtonClick: function (e, icon) {
                this.trigger('header-button-click', e, icon);
            }
        });
    }
)
