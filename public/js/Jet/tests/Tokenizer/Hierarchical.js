/**
 * Created by andrii.muzalevskyi on 21.08.2014.
 */
define(
    [
        'module',
        'Jet/tests/runner'
    ],
    function (module, runner) {
        runner.describe(module, function (Hierarchical, module) {
            with (Hierarchical) {
                it("sym()", function () {
                    expect(sym("a")("a", 0, 1).error).toBeUndefined();
                    expect(sym("a")("a", 0, 1).a).toEqual(1);
                    expect(sym("a")("b", 0, 1).error).toBeTruthy();
                    expect(sym("b")("b", 0, 1).error).toBeUndefined();
                    expect(sym("b")("a", 0, 1).error).toBeTruthy();
                    expect(sym("ab")("b", 0, 1).error).toBeUndefined();
                    expect(sym("ab")("a", 0, 1).error).toBeUndefined();
                    expect(sym("ab")("c", 0, 1).error).toBeTruthy();

                    expect(sym("ab")("c", 0, 1).wait).toEqual("ab");
                    expect(sym("ab")("c", 0, 1).pos).toEqual(0);
                    expect(sym("ab")("c", 0, 1).sym).toEqual("c");

                    expect(sym("a")("ba", 1, 2).error).toBeUndefined();
                    expect(sym("b")("ba", 1, 2).error).toBeTruthy();
                });
                it("reg()", function () {
                    expect(regexp(/a/)("a", 0, 2).error).toBeUndefined();
                    expect(regexp(/a/)("b", 0, 2).error).toBeTruthy();
                    expect(regexp(/a?/)("b", 0, 2).error).toBeUndefined();

                    expect(regexp(/a/)("a", 0, 2).token).toEqual("a");
                    expect(regexp(/a/)("a", 0, 2).a).toEqual(1);

                    expect(regexp(/ab/)("_ab", 1, 3).token).toEqual("ab");
                    expect(regexp(/ab/)("_ab_ab", 4, 7).token).toEqual("ab");
                    expect(regexp(/ab/)("_ab_ab", 3, 7).error).toBeTruthy();
                    expect(regexp(/ab/)("_ab", 1, 3).a).toEqual(3);
                });
                it("opt()", function () {
                    expect(opt("a")("a", 0, 1).error).toBeUndefined();
                    expect(opt("a")("a", 0, 1).length).toEqual(2);
                    expect(opt("a")("b", 0, 1).error).toBeUndefined();
                    expect(opt("a")("b", 0, 1).a).toEqual(0);
                });
                it("seq()", function () {
                    expect(seq("a", "b")("ab", 0, 1).error).toBeUndefined();
                    expect(seq("a", "b")("ab", 0, 1).a).toEqual(2);
                    expect(seq("a", "b")("ab", 0, 1).token).toEqual("ab");
                    expect(seq("a", "b")("ba", 0, 1).error).toBeTruthy();
                    expect(seq(opt("a"), "b")("ba", 0, 1).error).toBeUndefined();
                    expect(seq("a", "b")("", 0, 1).error).toBeTruthy();
                });
                it("choice()", function () {
                    expect(choice("a", "b")("a", 0, 1).error).toBeUndefined();
                    expect(choice("a", "b")("b", 0, 1).error).toBeUndefined();
                    expect(choice("a", "b")("c", 0, 1).error).toBeTruthy();

                    // should return first option only
                    expect(choice("a", "b")("a", 0, 1).length).toBeUndefined();
                    // all options returned in array
                    expect(choice("a", "a")("a", 0, 1).length).toEqual(2);
                });
                it("seq() of choice() and opt()", function () {
                    var aOrDoubleA = ch("a", seq("a", "a")),
                        bOrDoubleB = ch("b", seq("b", "b")),
                        expr = seq(aOrDoubleA, "b"),
                        expr2 = seq("a", opt("a"), "b"),
                        expr3 = seq(aOrDoubleA, bOrDoubleB);
                    expect(expr("ab", 0, 1).error).toBeUndefined();
                    expect(expr("aab", 0, 1).error).toBeUndefined();

                    expect(expr2("ab", 0, 1).error).toBeUndefined();
                    expect(expr2("aab", 0, 1).error).toBeUndefined();

                    expect(expr3("ab", 0, 1).error).toBeUndefined();
                    expect(expr3("aab", 0, 1).error).toBeUndefined();
                    expect(expr3("abb", 0, 1).error).toBeUndefined();
                    expect(expr3("aabb", 0, 1).error).toBeUndefined();
                    expect(expr3("aacc", 0, 1).error).toBeTruthy();

                });

                it("repeat()", function () {
                    var rep = repeat("a", 0, 2),
                        repFrom1 = repeat(("a"), 1, 2),
                        repSeq = repeat(seq("a", "b"), 1, 2);
                    expect(rep("", 0).error).toBeUndefined();
                    expect(rep("b", 0).error).toBeUndefined();
                    expect(rep("a", 0).error).toBeUndefined();
                    expect(rep("aa", 0).error).toBeUndefined();


                    expect(repFrom1("", 0).error).toBeTruthy();
                    expect(repFrom1("b", 0).error).toBeTruthy();
                    expect(repFrom1("a", 0).error).toBeUndefined();
                    expect(repFrom1("aa", 0).error).toBeUndefined();

                    expect(repSeq("a", 0).error).toBeTruthy();
                    expect(repSeq("b", 0).error).toBeTruthy();
                    expect(repSeq("ab", 0).error).toBeUndefined();
                    expect(repSeq("abab", 0).length).toEqual(2);
                });

                it("prop()", function () {
                    var parsed = prop("x", 1)("", 0, 0, {});
                    expect(parsed.error).toBeUndefined();
                    expect(parsed.res.x).toEqual(1);

                    parsed = prop("attrName", /\w+/i)("document.Location = smth", 9, 100, {});
                    expect(parsed.error).toBeUndefined();
                    expect(parsed.res.attrName).toEqual("Location");

                    //with seq
                    parsed = prop("attrName", seq(/[A-Z]/, /[a-z]+/i))("document.Location = smth", 9, 100, {});
                    expect(parsed.error).toBeUndefined();
                    expect(parsed.res.attrName).toEqual("Location");

                    // should not accept lowercase letter in location
                    parsed = prop("attrName", seq(/[A-Z]/, /[a-z]+/i))("document.location = smth", 9, 100, {});
                    expect(parsed.error).toBeTruthy();

                    // prop in sequence
                    parsed = seq(prop("instanceName", /[a-z]+/i), '.', prop("attrName", /[a-z]+/i))("document.location", 0, 100, {});
                    expect(parsed.error).toBeUndefined();
                    expect(parsed.res.instanceName).toEqual("document");
                    expect(parsed.res.attrName).toEqual("location");

                    // prop in choice
                    var expr = seq(
                        prop("instanceName", /[a-z]+/i),
                        '.',
                        prop("attrName", /[a-z]+/i),
                        /\s*/, "=", /\s*/,
                        token('value', choice(
                            seq(prop("type", "number"), prop('value', /[0-9]+/)),
                            seq(prop("type", "variable"), prop('value', /[a-z]+/i))
                        ))
                    );

                    parsed = expr("document.location = 15", 0, 100, {});
                    var parsed2 = expr("document.location = x", 0, 100, {});

                    expect(parsed.error).toBeUndefined();
                    expect(parsed.res.instanceName).toEqual("document");
                    expect(parsed.res.attrName).toEqual("location");

                    expect(parsed.res.value).toBeDefined();
                    expect(parsed.res.value.type).toEqual("number");
                    expect(parsed.res.value.value).toEqual("15");

                    expect(parsed2.res.value).toBeDefined();
                    expect(parsed2.res.value.type).toEqual("variable");
                    expect(parsed2.res.value.value).toEqual("x");
                });

                it("token()", function () {
                    var parsed = token("token", prop("xtype", "test token"))("", 0, 0, {});
                    expect(parsed.error).toBeUndefined();
                    expect(parsed.res.token).toBeDefined();
                    expect(parsed.res.token ? parsed.res.token.xtype : undefined).toEqual("test token");

                    // token in sequence
                });

                it("tokenList", function(){
                    var stringParser = ch(
                        seq("'", tokenList('inner', choice(
                                prop('t', seq('\\', any)),
                                seq('\\', prop('t', "'")),
                                prop('t', /[^'\\]*/)
                            ), "'")),
                        seq("\"", tokenList('inner', choice(
                                seq('\\', prop('t', '"')),
                                prop('t', seq('\\', any)),
                                prop('t',/[^"\\]*/)
                            ), "\""))
                    );

                    var parsed = stringParser("'\\\'sdfg\\f'", 0, 100, {});

                });
            }
        });
    }
);