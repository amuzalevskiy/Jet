define(
    function(){
        function SimpleTokenizer (tokens, firstToken) {
            this.firstToken = firstToken;
            var specs = this.tokens = [];
            // parse tokens
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                if (token.toLowerCase || token instanceof RegExp) {
                    specs.push(token);
                    decl.push({
                        type: 0
                    })
                    continue;
                }
                this['T_' + token.name] = i;
                specs.push(token.decl);
            }
        };

        SimpleTokenizer.prototype = {
            parse: function (income) {
                var outcome = [],
                    lastFoundTokenPos = [],
                    currentPos = 0,
                    maxPos = income.length,
                    token,
                    tokens = this.tokens,
                    tokenCount = tokens.length,
                    MAX_VALUE = Number.MAX_VALUE,
                    i;
                // init token positions
                for (i = 0; i < tokenCount; i++) {
                    lastFoundTokenPos[i] = -1;
                }
                while (1) {
                    var minIndex = -1,
                        minPos = MAX_VALUE;
                    // find nearest token
                    for (i = 0; i < tokenCount; i++) {
                        var tokenPos = lastFoundTokenPos[i];
                        // ensure token position
                        // if last found position less than current find it again
                        if (tokenPos < currentPos) {
                            token = tokens[i];
                            // @todo optimize RegExp search
                            tokenPos = lastFoundTokenPos[i] = token.toLowerCase
                                ? income.indexOf(token, currentPos)
                                : (income.substr(currentPos).search(token) + currentPos);
                            // if it found
                            if (tokenPos < currentPos) {
                                tokenPos = lastFoundTokenPos[i] = MAX_VALUE;
                            }
                        }
                        // find nearest token
                        if (minPos > tokenPos) {
                            minPos = tokenPos;
                            minIndex = i;
                        }
                    }
                    if (minPos == MAX_VALUE) {
                        // ok, we at end, if something lasts - add it
                        if (currentPos < maxPos) {
                            outcome.push({
                                t: income.substring(currentPos, maxPos)
                            });
                        }
                        break;
                    }
                    if (minPos != currentPos) {
                        // have something undeclared here
                        outcome.push({
                            t: income.substring(currentPos, minPos)
                        });
                    }

                    // find token declaration
                    token = tokens[minIndex];

                    var res = {
                        i: minIndex,
                        t: token.toLowerCase ? token : token.exec(income.substr(minPos))[1]
                    };

                    // save result
                    outcome.push(res);

                    // check to avoid endless cycle
                    if (res.t.length == 0) {
                        throw new Error("Empty token");
                    }

                    // shift position
                    currentPos = minPos + res.t.length;
                }

                // callback to redefine in child classes
                this.afterParse();

                /**
                 * Store link to the tokenizer to later usage of tokens indexes as
                 * <code>res.tokenizer.T_SOME_TOKEN</code>
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