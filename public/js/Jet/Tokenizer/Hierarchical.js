define(
    function () {
        function SimpleTokenizer(tokens, firstToken) {
            this.firstToken = firstToken;
            var specs = this.tokens = [],
                decl = this.decl = [],
                byName = this.byName = [],
                allIndexes = this.allIndexes = [];
            // parse tokens
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                allIndexes.push(i);
                if (token.toLowerCase || token instanceof RegExp) {
                    specs.push(token);
                    decl.push({
                        type: 0,
                        i: i
                    })
                    continue;
                }
                this['T_' + token.name] = byName[token.name] = i;
                specs.push(token.decl);
                token.i = i;
                token.type = token.accept ? 1 : 0;
                decl.push(token);
            }
            // parse declarations, replace string names with indexes
            for (var i = 0; i < tokens.length; i++) {
                if (decl[i].type == 1) {
                    // accept
                    var accept = decl[i].accept, indexedAccept = [];
                    for (var j = 0; j < accept.length; j++) {
                        indexedAccept.push(byName[accept[i]]);
                    }
                    decl[i].accept = indexedAccept;

                    // end
                    decl[i].end = byName[decl[i].end];
                }
            }
        };

        SimpleTokenizer.prototype = {
            parse: function (income, currentToken) {
                var outcome = [],
                    tokenPositions = [],
                    tokenPosition,
                    currentPosition = 0,
                    maxPosition = income.length,
                    minIndex,
                    minPosition,
                    token,
                    tokens = this.tokens,
                    currentToken = this.decl[currentToken || this.firstToken] || {
                        accept: this.allIndexes
                    },
                    tokenCount = tokens.length,
                    MAX_VALUE = Number.MAX_VALUE,
                    i;
                // init token positions
                for (i = 0; i < tokenCount; i++) {
                    tokenPositions[i] = -1;
                }
                function ensureTokenPosition(token) {
                    tokenPosition = tokenPositions[token.i];
                    if (tokenPosition < currentPosition) {
                        tokenPosition = tokenPositions[i] = token.toLowerCase
                            ? income.indexOf(token, currentPosition)
                            : (income.substr(currentPosition).search(token) + currentPosition);
                        // if it found
                        if (tokenPosition < currentPosition) {
                            tokenPosition = tokenPositions[i] = MAX_VALUE;
                        }
                    }
                    if (minPosition > tokenPosition) {
                        minPosition = tokenPosition;
                        minIndex = i;
                    }
                }

                while (1) {
                    minIndex = -1;
                    minPosition = MAX_VALUE;
                    for (i = 0; i < currentToken.accept.length; i++) {
                        // ensure token position
                        ensureTokenPosition(this.decl[currentToken.accept[i]]);
                    }
                    if (currentToken.end) {
                        ensureTokenPosition(this.decl[i]);
                    }
                    if (minPosition == MAX_VALUE) {
                        // ok, we at end
                        if (currentPosition < maxPosition) {
                            outcome.push({
                                t: income.substring(currentPosition, maxPosition)
                            });
                        }
                        break;
                    }
                    if (minPosition != currentPosition) {
                        // have something undeclared here
                        outcome.push({
                            t: income.substring(currentPosition, minPosition)
                        });
                    }
                    token = tokens[minIndex];
                    var res = {
                        i: minIndex,
                        t: token.toLowerCase ? token : token.exec(income.substr(minPosition))[1]
                    };
                    outcome.push(res);
                    if (res.t.length == 0) {
                        throw new Error("Empty token");
                    }
                    if (true) {

                    }
                    currentPosition = minPosition + res.t.length;
                }
                this.afterParse();
                /**
                 * Store link to the tokenizer to later usage of tokens indexes as
                 * <code>res.tokenizer.T_SOME_TOKEN</code>
                 * @type {SimpleTokenizer}
                 */
                outcome.tokenizer = this;
                return outcome;
            },
            afterParse: function () {

            }
        }

        return SimpleTokenizer;
    }
)