/**
 * Object that could be extended in Backbone way
 */

define(
    [
        'module',
        './Jet',
        './Impl/StdClassImpl',
        './Impl/CollectionImpl',
        './Field',
        './Basic/Pair',
        './ViewBuilder',

        // load all Field realizations
        './Field/Collection',
        './Field/String',
        './Field/Object',


        './Field/Boolean',
        './Field/Int',
        './Field/Float',
        './Field/Date',

        './Field/Html',
        './Field/Accessor',
        './Field/Function',
        './Field/Constructor',

        './ClassDecl/Quick' // this will force quick declaration parsing of all fields
    ],

    function (module, Jet, StdClassImpl, CollectionImpl, Field, Pair, ViewBuilder, CollectionField, StringField, ObjectField) {

        var decl = {
            fields: new CollectionImpl([
                new StringField({name: "name"}),
                new StringField({name: "label"}),
                new ObjectField({name: "base", type: Object}),
                new StringField({name: "for"}),
                new CollectionField({name: "fields", base: Field}),
                new Field({name: "views"})
            ])
        };

        var ClassDecl = StdClassImpl.extend({
            moduleId: module.id,
            decl: decl,

            constructor: function (attributes) {
                !attributes && (attributes = {});
                !attributes.fields && (attributes.fields = []);
                if (attributes.base && !attributes.replaceParent) {
                    attributes.fields.unshift.apply(attributes.fields, attributes.base.fields.items);
                }
                this.parse(attributes);
                // fix attribute duplicates
                // use the new one
                var fields = this.fields.items;
                for (var i = fields.length - 1; i >= 0; i--) {
                    var all = this.fields.where({name: fields[i].name});
                    if (all.length > 1) {
                        // underscore reverse found items
                        if (all[0].final) {
                            throw "Trying to redefine final field <" + fields[i].name + "> in <" + this.for + ">";
                        }
                        var neededField = all[all.length - 1],
                            baseField = all[all.length - 2];
                        neededField = Field.fromJSON(_.extend({},baseField.initOptions, neededField.initOptions));
                        // remove others
                        this.fields.remove(all, {silent: true});
                        i += 1 - all.length;
                        // add needed
                        this.fields.push(neededField, { at: i, silent: true });
                    }
                }
                // resolve dependencies
                for (i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    if (field.depend) {
                        var dependencies = field.depend.split(" "),
                            maxIndex = -1;
                        for (var j = 0; j < dependencies.length; j++) {
                            var dependencyName = dependencies[j],
                                index = this.fields.indexOf(this.fields.findByName(dependencyName));
                            if (index == -1) {
                                throw "Could not find field <" + dependencyName + "> specified in dependencies for field <" + field.name + ">";
                            }
                            index > maxIndex && (maxIndex = index);
                        }
                        if (maxIndex > i) {
                            fields.splice(i,1); // remove old
                            fields.splice(maxIndex,0,field); // insert into maxIndex position
                        }
                    }
                }
            },

            getView: function (obj, viewName, options) {
                var view = Jet.theme.getBuilder(obj, viewName);
                return view.build(obj, options);
            }
        },{
            getDecl: function () {
                return decl;
            }
        });

        /**
         * Generic function to get views
         *
         * @param name
         * @returns {*}
         */
        var getView = function (name) {
            return this.getDecl().getView(this, name);
        }

        Jet.addMixin('decl', function (){
            var protoProps = this.constructor.prototype;

            this.decl = this.decl || {};
            this.constructor.__super__ && (this.decl.base = this.constructor.__super__.getDecl(false));

            this.decl.for = this.constructor.prototype.moduleId;

            var decl = new ClassDecl(this.decl);

            this.constructor.getDecl = protoProps.getDecl = function () {
                return decl;
            }

            // add views
            if (decl.views)
                Jet.baseTheme.addBuilders(this.constructor, decl.views);
            protoProps.getView = getView;

            // register shortcuts
            // findBy<Field>
            protoProps._g = {};
            protoProps._s = {};
            decl.fields.each(function (field) {
                field.addAccessorFns(protoProps);
            });
        });

        return ClassDecl;
    }
);