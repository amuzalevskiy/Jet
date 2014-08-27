define(
    [
        'module',
        '../../View',
        '../Panel',
        '../Button',
        'tpl!Jet/TabPanel'
    ],
    function (module, View, Panel, Button, templateTabPanel) {
        return Panel.extend({
            moduleId: module.id,
            template: templateTabPanel,
            cssClass: "j-panel",
            decl: {
                fields: [
                    {
                        name: "items",
                        jet: "Collection",
                        base: Panel
                    },
                    {
                        name: "selected",
                        jet: "Int",
                        defaultValue: 0,
                        onUpdate: function (tabPanel) {
                            // santize
                            tabPanel.selected = Math.max(0,Math.min(tabPanel.selected, tabPanel.items.length - 1));
                        }
                    },
                    {
                        name: "selectedPanel",
                        _get: function (tabPanel) {
                            return tabPanel.items.at(tabPanel.selected);
                        }
                    }
                ]
            }
        });
    }
)