/**
 * Created by andrii.muzalevskyi on 22.08.2014.
 */
define(
    [
        'module',
        'Jet/tests/runner'
    ],
    function (module, runner) {
        runner.describe(module, function (JavasciptTokenizer, module) {
            with(JavasciptTokenizer) {
                it("string", function () {
                    expect(string("\"\"",0,100,{}).error).toBeUndefined();
                    expect(string("", 0, 100, {}).error).toBeUndefined();
                })
            }
        });
    }
)