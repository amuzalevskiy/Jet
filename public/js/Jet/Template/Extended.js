/**
 * Wrapper for underscore template
 *
 * supports blocks - <block:name>code</block:name>
 * supports configuration - <## container {el:'div} ##>
 * <## importCss ##> - will import css file with the same path and name
 * <## importCss another.css ##> located in Theme/folder/tpl.html will load Theme/folder/another.css
 */

define(
    [
        'module',
        '../Template'
    ],

    function (module, Template, Stylesheet) {
        var __counters = {};
        var _addCounter = function (source) {
            if (__counters[source] !== undefined) {
                __counters[source]++;
                return source + '[' + __counters[source] + ']';
            } else {
                __counters[source] = 0;
                return source;
            }
        }
        var stylesheets = [];
        var Extended = Template.extend({
            moduleId: module.id,
            block: null,
            _compiled: null,
            decl: {
                fields: [
                    {
                        name: "sourceURL",
                        jet: "String"
                    },
                    {
                        name: "content",
                        jet: "String"
                    }
                ]
            },
            constructor: function (options) {
                this.block = {};
                this.setTemplateContent(options.content, options);
            },
            setTemplateContent: function (tpl, options) {
                options = options || {};
                options.sourceURL = _addCounter(options.sourceURL || '__no-source__');

                // blocks search
                var blockStartRe = /<\s*block\:(\w+)([^>]*)>/ig,
                    lastBlockEndIndex = 0, startRes, endRes, startIndex, endIndex, blockCode, endRe, blockName;
                if (startRes = blockStartRe.exec(tpl)) {
                    var tplC = "";
                    do{
                        blockName = startRes[1];
                        startIndex = blockStartRe.lastIndex;
                        endRe = new RegExp('</\\s*block\\:' + blockName + '\\s*>','ig');
                        endRe.lastIndex = blockStartRe.lastIndex;
                        endRes = endRe.exec(tpl);
                        endIndex = endRe.lastIndex;
                        blockCode = tpl.substr(startIndex, endIndex - endRes[0].length - startIndex);
                        options.blockName = blockName;
                        this.block[blockName] = new Extended({
                            sourceURL: options.sourceURL + '/-' + blockName + '-',
                            content: blockCode,
                            uri: options.uri
                        });
                        tplC += tpl.substr(lastBlockEndIndex, startIndex - startRes[0].length - lastBlockEndIndex);
                        lastBlockEndIndex = endIndex;
                    } while (startRes = blockStartRe.exec(tpl));
                    tpl = tplC + tpl.substr(lastBlockEndIndex);
                }

                // parse options
                // like <@ @>
                var splitRe = /\##\>/;
                if (splitRe.test(tpl)) {
                    // split by end tag
                    var parts = tpl.split(/\##\>/),
                    // find Re
                        findRe = /<##\s*(\w+)(|\s+(.*\S))\s*$/,
                        partsLengthUsed = parts.length - 1;

                    for (var i = 0; i < partsLengthUsed; i++) {
                        var part = parts[i],
                            res = findRe.exec(part);
                        if (!res) {
                            var allDirective = /<##.*$/.exec(part);
                            if (allDirective) {
                                console.log(tpl);
                                throw "Cannot parse directive " + allDirective[0] + "##>";
                            } else {
                                console.log(tpl);
                                throw "Found close directive tag, but directive is not opened";
                            }
                        }
                        var directive = res[1], content = res[3];
                        switch (directive) {
                            case "importCss":
                                if (content) {
                                    this.ensureStylesheet(options.uri.substr(0, options.uri.lastIndexOf('/') + 1) + content);
                                } else {
                                    this.ensureStylesheet(options.uri + '.css');
                                }
                                break;
                            default:
                                var value;
                                try {
                                    eval("this[directive]=" +content);
                                } catch (e) {
                                    throw "Invalid directive format " + res[0] + "##>. " + e.message;
                                }
                        }
                        parts[i] = parts[i].substr(0, -res[0].length);
                    }
                    tpl = parts.join('');
                }
                this._compiled = _.template(tpl, undefined, {sourceURL: '__tpl__/' + options.sourceURL});
            },

            getInnerHTML: function (options) {
                options.__block = this.block;
                return this._compiled(options);
            },

            /**
             * Adds stylesheet to the page if it's not added yet
             *
             * @param name
             */
            ensureStylesheet: function (url) {
                if (stylesheets[url]) {
                    return;
                }
                stylesheets[name] = true;
                var tag = '<link rel="stylesheet" type="text/css" href="' + url + '" media="screen" />';
                document.head.insertAdjacentHTML('beforeend', tag);
            }
        });

        // compatibility
        Extended.prototype.render = Extended.prototype.getInnerHTML;

        return Extended;
    }
);