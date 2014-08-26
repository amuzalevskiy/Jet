/**
 * Declaration what doesn't support validation, any complex fields. Just copies properties as is.
 * It used at startup time, while real ClassDecl is unavailable.
 */

define(
    [
        'module',
        '../Jet',
        '../Impl/StdClassImpl',
        '../Impl/FieldImpl'
    ],

    function (module, Jet, StdClassImpl, FieldImpl) {

        var ClassDeclQuick = StdClassImpl.extend({
            moduleId: module.id,
            constructor: function (attributes) {
                this.for = attributes.for;
                this.fields = new FieldImpl.Collection();
                if (attributes.base) {
                    this.fields.add(attributes.base.fields.items);
                }
                if (attributes && attributes.fields) {
                    for (var i = 0; i < attributes.fields.length; i++) {
                        var fieldName = attributes.fields[i].name;
                        this.fields.add(new FieldImpl({name: fieldName}));
                    }
                }
            }
        });

        Jet.addMixin('quickdecl', function (){

            var protoProps = this.constructor.prototype;

            this.decl = this.decl || {};
            this.decl.for = this.constructor.prototype.moduleId;

            this.decl.base = this.constructor.__super__.getDecl(false);

            var decl = new ClassDeclQuick(this.decl);
            this.constructor.getDecl = protoProps.getDecl = function () {
                return decl;
            }

            // register shortcuts
            // findBy<Field>
            protoProps._g = {};
            protoProps._s = {};
            decl.fields.each(function (field) {
                field.addAccessorFns(protoProps, true);
            });

            // mix real declaration
            Jet.mixin('decl', this);
        });

        return ClassDeclQuick;
    }
);