define(['./Hierarchical'], function(Hierarchical){
    with(Hierarchical){
        function outta(name){
            var fn;
            return function(){
                if(!fn){
                    fn = JavascriptTokenizer[name];
                }
                return fn.apply(JavascriptTokenizer, arguments);
            }
        }
        JavascriptTokenizer = {
            string: seq(
                prop("type","string"),
                ch(
                    seq("'", tokenList('value', choice(
                        seq('\\', prop('t', any)),
                        prop('t', /[^'\\]*/)
                    ), "'")),
                    seq("\"", tokenList('value', choice(
                        seq('\\', prop('t', any)),
                        prop('t', /[^"\\]*/)
                    ), "\""))
                ),
                overRes(function(res){
                    var tmp = [];
                    for (var i = 0; i < res.value.length; i++) {
                        tmp.push(res.value[i].t);
                    }
                    res.value = tmp.join("");
                })
            ),

            bool: seq(
                prop("type", "bool"),
                prop("value",
                    ch(
                        /false/,/true/
                    )
                ),
                overRes(function(res){
                    res.value = res.value == 'true';
                })
            ),

            number: seq(
                prop("type", "number"),
                prop("value",
                    /([0-9]*(|\.[0-9]*)|0x[0-9a-f]+)/i
                ),
                overRes(function(res){
                    res.value = eval(res.value)
                })
            ),

            array: seq(
                prop("type", "array"),
                "[",
                tokenList('value', outta("valExpr")),
                "]"
            ),

            object: seq(
                prop("type", "object"),
                ch()
            ),

            identifier: seq(
                prop("type", "id"),
                prop("name", /[a-z_$][0-9a-z_$]*/),
                over(function (all) {
                    // reserved words
                    if(/^(break|default|function|return|var|case|delete|if|switch|void|catch|do|in|this|while|const|else|instanceof|throw|with|continue|finally|let|try|debugger|for|new|typeof)$/.test(res.name)) {
                        all.error =  "Reserved word";
                    }
                })
            ),

            dotOp: seq(
                outta('valExpr'),
                '.',
                outta("identifier")
            ),

            arrayOp: seq(
                outta('valExpr'),
                '[',
                outta('valExpr'),
                ']'
            ),

            valExpr: ch(
                outta("string"),
                outta("bool"),
                outta("number"),
                outta("array"),
                outta("object"),
                outta('dotOp'),
                outta('arrayOp'),
                outta("identifier")
            ),

            expr: ch(
                outta('valExpr')
            ),

            unaryOp: ch(
                seq(prop('unaryPre'),/(-|\+\+|--)/, outta('valExpr')),
                seq(prop('unaryPost'),outta('valExpr'), /(\+\+|--)/)
            ),

            binaryOp: seq(
                outta('valExpr'),
                /[-+*/%]/,
                outta('valExpr')
            ),

            ternaryOp: seq(
                outta('valExpr'), '?', outta('valExpr'), ":", outta('valExpr')
            )
        };
    }
    return JavascriptTokenizer;
});