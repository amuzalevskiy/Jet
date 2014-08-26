/**
 * Created by andrii.muzalevskyi on 22.08.2014.
 */
define(
    [
        'module',
        'Jet/tests/runner'
    ],
    function (module, runner) {
        runner.describe(module, function (SimpleTokenizer, module) {
            describe("parse()", function(){
                beforeEach(function(){
                    this.tokenizer = new SimpleTokenizer([
                        {name: "WHITESPACE", decl: /(\s+)/},
                        {name: "FOR", decl: /(for)[^a-z_$0-9]/},
                        {name: "IF", decl: /(if)[^a-z_$0-9]/},
                        {name: "ELSE", decl: /(else)[^a-z_$0-9]/},
                        {name: "WHILE", decl: /(while)[^a-z_$0-9]/},
                        {name: "OPEN", decl: '{'},
                        {name: "CLOSE", decl: '}'},
                        {name: "VAR", decl: /([a-z_$][a-z_$0-9]*)/i}
                    ]);
                });
                it("valid result with empty string", function () {
                    expect(this.tokenizer.parse("").length).toEqual(0);
                })
                it("valid string founds", function () {
                    var res;
                    res = this.tokenizer.parse("forif");
                    expect(res.length).toEqual(1);
                    expect(res[0].i).toEqual(7);
                    expect(res[0].t).toEqual("forif");
                    expect(this.tokenizer.parse("for if").length).toEqual(3);
                    expect(this.tokenizer.parse("for{if").length).toEqual(3);

                    res = this.tokenizer.parse("for { if");
                    expect(res.length).toEqual(5);
                    expect(res[0].i).toEqual(1);
                    expect(res[0].t).toEqual("for");
                    expect(res[3].i).toEqual(0);
                    expect(res[3].t).toEqual(" ");
                })
            });
        })
    }
)