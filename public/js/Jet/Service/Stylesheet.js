/**
 * Allows to add and remove rules in stylesheet.
 * It must be singleton
 */
define(
    [
        'underscore',
        'jquery'
    ],
    function (_, $) {
        var isOldIE = !document.styleSheets[0].cssRules,
            sheet = document.styleSheets[0],
            _cssElm = $('<div>');
        //_cssElm.appendTo(document.body);
        
        return {

            /**
             * shift of added items
             */
            baseItemsCount: sheet[isOldIE ? 'rules' : 'cssRules'].length,

            /**
             * select native realization
             */
            _add: isOldIE
                ? function (selector, decl) {sheet.addRule(selector, decl)}
                : function (selector, decl) {sheet.insertRule(selector + '{' + decl + '}', sheet.cssRules.length)},
            _remove: isOldIE
                ? function (index) {sheet.removeRule(index)}
                : function (index) {sheet.deleteRule(index)},

            /**
             * Creates string representation of cssProps object

             * Example:
             * this.cssPropsToString({borderWidth: 5}) === "border:5px;"
             */
            cssPropsToString: function (styles) {
                return _cssElm.attr('style', '').css(styles).attr('style');
            },

            /**
             * Keep all currently added selectors
             */
            addedRules: [],

            /**
             * Adds stylesheet rule
             *
             * @param selector {String}
             * @param decl {String|cssPropObject}
             */
            addRule: function (selector, decl) {
                // accept cssProp object
                _.isString(decl) || (decl = this.cssPropsToString(decl));

                // remove previous
                this.removeRule(selector);

                this._add(selector, decl);

                this.addedRules.push(selector);
            },

            /**
             * Removes stylesheet rule by selector
             *
             * @param selector {String}
             */
            removeRule: function (selector) {
                var i = _.indexOf(this.addedRules, selector);
                if (i != -1) {
                    this._remove(this.baseItemsCount + i);
                    this.addedRules.splice(i, 1);
                }
            }
        }
    }
)