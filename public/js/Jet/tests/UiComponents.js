﻿define([
        '../Init',
        'Jet/StdClass',
        'Jet/View',
        'Jet/Template',
        'Jet/Const',

        'Jet/Model/Action',

        'Jet/View/Panel',
        'Jet/View/Panel/Tab',
        'Jet/View/Button',
        'Jet/View/ButtonGroup',
        'Jet/View/Link',
        'Jet/View/Decorator/Label',

        'Jet/Basic/Content',
],

    function (
        Jet, StdClass, View, Template, Const,
        Action,
        Panel, TabPanel, Button, ButtonGroup, Link, Label,
        Content
        ) {

        function buttonCallback() {
            alert("Clicked <" + this.model.getText() + "> button" + (this.model.getIcon() ? " with icon <" + this.model.getIcon() + ">" : "" ));
        }

        return {

            addAll: function (el) {
                for (var groupName in this.tests) {
                    el.append(
                        "<style>" +
                            ".test-area {box-sizing: border-box; padding: 15px 30px; width: 100%; overflow: hidden}" +
                            ".test-wrapper {margin: 4px; width: 260px; overflow: hidden; float: left}" +
                            ".test-wrapper-wide {margin: 4px; width: 100%; overflow: hidden;}" +
                            ".test-area-concrete {overflow: hidden;}" +
                        "</style>"
                    );
                    el.append('<div class="test-area"><h3>' + groupName + '</h3></div>');
                    var groupEl = el.find('.test-area:last');
                    for (var testName in this.tests[groupName]) {
                        groupEl.append('<div class="test-wrapper' + (testName[0] == '!' ? '-wide' : '') + '"><h4>' + testName + '</h4><div class="test-area-concrete"></div></div>');
                        var testEl = groupEl.find('.test-area-concrete:last');
                        this.tests[groupName][testName].call(this, testEl);
                    }
                }
            },

            createBoxHtml: function (w, h, style) {
                var box = $('<div style="width:' + w + 'px; height:' + h + 'px; background: url(/img/test-bg.png);"></div>');
                box.css(style || {});
                return box[0].outerHTML;
            },

            createBoxView: function (w, h, margin) {
                margin = margin || 10;
                var view = new View({ html: View.counter, width: w, height: h});
                view.css.background = "url(/img/test-bg.png)";
                view.css.border = "solid " + margin + "px white";
                return view;
            },

            getModel: function () {
                var constructor = StdClass.extend({
                    moduleId: "TestModel",
                    decl: {
                        fields: [
                            {
                                name: "string",
                                jet: "String"
                            },
                            {
                                name: "int",
                                jet: "Float"
                            },
                            {
                                name: "float",
                                jet: "Float"
                            },
                            {
                                name: "date",
                                jet: "Date"
                            }
                        ]
                    }
                });
                return new constructor({
                        string: "Lorem ipsum",
                        int: 2,
                        float: 3.2,
                        date: new Date()
                });
            },

            getCollection: function () {

            },

            getViewCollection: function () {
                return new View.Collection([
                    this.createBoxView(35, 35),
                    this.createBoxView(50, 50),
                    this.createBoxView(20, 20)
                ])
            },

            tests: {
                "Panels": {
                    "Basic": function (el) {
                        (new Panel({
                            title: "Panel",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at felis nec nisi laoreet ullamcorper. Sed aliquet quam at massa efficitur interdum. Nullam mattis eu neque et semper. Duis nulla neque, fringilla eu orci suscipit, porttitor elementum lacus. Donec felis mauris, lacinia sed fermentum sit amet, tincidunt sed orci."
                        })).insertTo(el);
                    },
                    "With header": function (el) {
                        (new Panel({
                            title: "Panel with buttons and icon",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at felis nec nisi laoreet ullamcorper. Sed aliquet quam at massa efficitur interdum. Nullam mattis eu neque et semper. Duis nulla neque, fringilla eu orci suscipit, porttitor elementum lacus. Donec felis mauris, lacinia sed fermentum sit amet, tincidunt sed orci.",
                            icon: "hdd",
                            headerButtons: "remove"
                        })).insertTo(el);
                    },
                    "No header": function (el) {
                        (new Panel({
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at felis nec nisi laoreet ullamcorper. Sed aliquet quam at massa efficitur interdum. Nullam mattis eu neque et semper. Duis nulla neque, fringilla eu orci suscipit, porttitor elementum lacus. Donec felis mauris, lacinia sed fermentum sit amet, tincidunt sed orci."
                        })).insertTo(el);
                    },
                    "Collapsible": function (el) {
                        (new Panel({
                            title: "Collapsible panel",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at felis nec nisi laoreet ullamcorper. Sed aliquet quam at massa efficitur interdum. Nullam mattis eu neque et semper. Duis nulla neque, fringilla eu orci suscipit, porttitor elementum lacus. Donec felis mauris, lacinia sed fermentum sit amet, tincidunt sed orci.",
                            collapsible: true
                        })).insertTo(el);
                    },
                    "TabPanel" : function (el) {
                        (new TabPanel({
                            items: [
                                {
                                    title: "Tab 1",
                                    content: "Lorem"
                                },
                                {
                                    title: "Tab 2",
                                    content: "Dolorem"
                                }
                            ]
                        })).insertTo(el);
                    }
                },
                "Default class views": {
                    "Editor": function (el) {
                        this.getModel().getView('edit').insertTo(el);
                    },
                    "Viewer": function (el) {
                        this.getModel().getView().insertTo(el);
                    },
                    "Table": function (el) {
                        //this.getCollection().getView('edit').insertTo(el);
                    }
                },
                "Fields": {
                    "String": function (el) {
                        this.getModel().getProperty('string').getView('edit').insertTo(el);
                    },
                    "Int": function (el) {
                        this.getModel().getProperty('int').getView('edit').insertTo(el);
                    },
                    "Float": function (el) {
                        this.getModel().getProperty('float').getView('edit').insertTo(el);
                    },
                    "Date": function (el) {
                        this.getModel().getProperty('date').getView('edit').insertTo(el);
                    },
                },
                "Validation": {
                },
                "Misc": {
                    "! Action and Action.Collection" : function (el) {
                        var action = new Action({
                            text: "Download",
                            icon: "download",
                            link: "http://google.com",
                            callback: function (e) {
                                alert("You requested download");
                            }
                        });

                        action.getView('view').insertTo(el);

                        action.getView('link').insertTo(el);

                        var actionCollection = new Action.Collection([
                            {
                                text: "Remove the desert",
                                icon: "map-marker",
                                callback: function () {
                                    alert("You removed the desert")
                                }
                            },
                            {
                                text: "Simplify wheel",
                                icon: "download",
                                callback: function () {
                                    alert("You simplified wheel")
                                }
                            },
                            {
                                text: "Cook pizza",
                                icon: "gift",
                                callback: function () {
                                    alert("You cooked pizza")
                                }
                            }
                        ]);
                        actionCollection.getView('view').insertTo(el);
                    },
                    "! Buttons and groups": function(el){
                        (new Label({
                            label: "Clean",
                            inner: new Button({text: "Save", callback: buttonCallback})
                        })).insertTo(el);
                        (new Label({
                            label: "Disabled",
                            inner: new Button({text: "Edit", disabled: true, callback: buttonCallback})
                        })).insertTo(el);
                        (new Label({
                            label: "With icon",
                            inner: new Button({text: "Like", icon: "thumbs-up", callback: buttonCallback})
                        })).insertTo(el);
                        (new Label({
                            label: "Icon-only",
                            inner: new Button({icon: "thumbs-up", callback: buttonCallback})
                        })).insertTo(el);

                        (new Label({
                            label: "Button group",
                            inner: new ButtonGroup({
                                items: [
                                    {text: "Ok", callback: buttonCallback},
                                    {text: "Cancel", callback: buttonCallback}
                                ]
                            })
                        })).insertTo(el);
                        (new Label({
                            label: "Collapsed Button group",
                            inner: new ButtonGroup({
                                collapse: true,
                                items: [
                                    {icon: "chevron-left", callback: buttonCallback},
                                    {text: "1", callback: buttonCallback},
                                    {text: "2", disabled: true, callback: buttonCallback},
                                    {text: "3", callback: buttonCallback},
                                    {text: "4", callback: buttonCallback},
                                    {icon: "chevron-right", callback: buttonCallback}
                                ]
                            })
                        })).insertTo(el);

                        (new Label({
                            label: "Vertical button group",
                            inner: new ButtonGroup({
                                vertical: true,
                                items: [
                                    {icon: "magnet", text: "Link", callback: buttonCallback},
                                    {icon: "tag", text: "Add tag", callback: buttonCallback},
                                    {icon: "envelope", text: "Send", callback: buttonCallback}
                                ]
                            })
                        })).insertTo(el);
                    },
                    "! Supported icons with <img src='http://glyphicons.com/wp-content/themes/glyphicons/sk/public/img/logo.svg'/>": function(el){
                        var all = "glass music search envelope heart star star-empty user film th-large th th-list ok remove zoom-in zoom-out off signal cog trash home file time road download-alt download upload inbox play-circle repeat refresh list-alt lock flag headphones volume-off volume-down volume-up qrcode barcode tag tags book bookmark print camera font bold italic text-height text-width align-left align-center align-right align-justify list indent-left indent-right facetime-video picture pencil map-marker adjust tint edit share check move step-backward fast-backward backward play pause stop forward fast-forward step-forward eject chevron-left chevron-right plus-sign minus-sign remove-sign ok-sign question-sign info-sign screenshot remove-circle ok-circle ban-circle arrow-left arrow-right arrow-up arrow-down share-alt resize-full resize-small plus minus asterisk exclamation-sign gift leaf fire eye-open eye-close warning-sign plane calendar random comment magnet chevron-up chevron-down retweet shopping-cart folder-close folder-open resize-vertical resize-horizontal hdd bullhorn bell certificate thumbs-up thumbs-down hand-right hand-left hand-up hand-down circle-arrow-right circle-arrow-left circle-arrow-up circle-arrow-down globe wrench tasks filter briefcase fullscreen";
                        all = all.split(" ");
                        var list = new View.Collection({layout: Const.layout.flow});
                        _.map(all,  function(iconName){
                            list.items.push(new Button({
                                text: iconName,
                                icon: iconName,
                                callback: buttonCallback
                            }))
                        });
                        list.itemGroup.setWidth(130);
                        list.itemGroup.setMargin(4);
                        list.insertTo(el);
                    }
                },
                "View.Collection - sorting is enabled for all View.Collections":{
                    "Basic": function (el) {
                        var list = new View.Collection({
                            width: 250,
                            height: 150,
                            sortable: true,
                            items: this.getViewCollection()
                        });
                        list.insertTo(el);
                    },
                    "overflow: auto": function (el) {
                        var list = new View.Collection({
                            width: 250,
                            height: 150,
                            sortable: true,
                            overflow: "auto",
                            items: this.getViewCollection()
                        });
                        list.insertTo(el);
                    },
                    "Layout - horizontal": function (el) {
                        var list = new View.Collection({
                            width: 250,
                            height: 150,
                            sortable: true,
                            overflow: "auto",
                            layout: Const.layout.horizontal,
                            items: this.getViewCollection()
                        });
                        list.insertTo(el);
                    },
                    "Layout - horizontal raw<br/><small>means no height setup</small>": function (el) {
                        var list = new View.Collection({
                            width: 250,
                            height: 150,
                            sortable: true,
                            overflow: "auto",
                            layout: Const.layout.horizontalRaw,
                            items: this.getViewCollection()
                        });
                        list.insertTo(el);
                    },
                    "Layout - vertical": function (el) {
                        var list = new View.Collection({
                            width: 250,
                            height: 150,
                            sortable: true,
                            overflow: "auto",
                            layout: Const.layout.vertical,
                            items: this.getViewCollection()
                        });
                        list.insertTo(el);
                    },
                    "Layout - vertical raw<br/><small>means no width setup</small>": function (el) {
                        var list = new View.Collection({
                            width: 250,
                            height: 150,
                            sortable: true,
                            overflow: "auto",
                            layout: Const.layout.verticalRaw,
                            items: this.getViewCollection()
                        });
                        list.insertTo(el);
                    },
                    "Layout - flow": function (el) {
                        var list = new View.Collection({
                            width: 250,
                            height: 150,
                            sortable: true,
                            overflow: "auto",
                            layout: Const.layout.flow,
                            items: this.getViewCollection()
                        });
                        list.insertTo(el);
                    }
                }
            }
        };

        return JetComponentTest;

    }
)