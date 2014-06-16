/// <reference path="jasmine.d.ts" />
var ScriptTemplate = require("../lib/index");

describe("ScriptTemplate Tests", function () {
    it("ignores none", function () {
        var template = "This is some text\r\n" + "\r\n" + "without any ignores\r\n";

        var eng = new ScriptTemplate(template);
        var actual = eng.run({});

        expect(actual).toBe(template);
    });

    it("ignores one with comment", function () {
        var template = "This is some text\r\n" + "\r\n" + "with one ignore after this line:\r\n" + "/*__ignore__*/ this should not show up\r\n" + "ignore was above this line";

        var expected = "This is some text\r\n" + "\r\n" + "with one ignore after this line:\r\n" + "ignore was above this line";

        var eng = new ScriptTemplate(template);
        var actual = eng.run({});

        expect(actual).toBe(expected);
    });

    it("ignores two with comment", function () {
        var template = "This is some text\r\n" + "\r\n" + "with one ignore after this line:\r\n" + "/*__ignore__*/ this should not show up\r\n" + "ignore was above and below this line\r\n" + "/*__ignore__*/ this also should not show up\r\n" + "ignore was above this line";

        var expected = "This is some text\r\n" + "\r\n" + "with one ignore after this line:\r\n" + "ignore was above and below this line\r\n" + "ignore was above this line";

        var eng = new ScriptTemplate(template);
        var actual = eng.run({});

        expect(actual).toBe(expected);
    });

    it("ignores two with comment and indent", function () {
        var template = "   This is some text\r\n" + "   \r\n" + "   with one ignore after this line:\r\n" + "   /*__ignore__*/ this should not show up\r\n" + "   ignore was above and below this line\r\n" + "   /*__ignore__*/ this also should not show up\r\n" + "   ignore was above this line";

        var expected = "   This is some text\r\n" + "   \r\n" + "   with one ignore after this line:\r\n" + "   ignore was above and below this line\r\n" + "   ignore was above this line";

        var eng = new ScriptTemplate(template);
        var actual = eng.run({});

        expect(actual).toBe(expected);
    });

    it("ignores two without comment", function () {
        var template = "This is some text\r\n" + "\r\n" + "with one ignore after this line:\r\n" + "__ignore__ this should not show up\r\n" + "ignore was above and below this line\r\n" + "__ignore__ this also should not show up\r\n" + "ignore was above this line";

        var expected = "This is some text\r\n" + "\r\n" + "with one ignore after this line:\r\n" + "ignore was above and below this line\r\n" + "ignore was above this line";

        var eng = new ScriptTemplate(template);
        var actual = eng.run({});

        expect(actual).toBe(expected);
    });

    it("ignores two without comment and with indent", function () {
        var template = "   This is some text\r\n" + "   \r\n" + "   with one ignore after this line:\r\n" + "   __ignore__ this should not show up\r\n" + "   ignore was above and below this line\r\n" + "   __ignore__ this also should not show up\r\n" + "   ignore was above this line";

        var expected = "   This is some text\r\n" + "   \r\n" + "   with one ignore after this line:\r\n" + "   ignore was above and below this line\r\n" + "   ignore was above this line";

        var eng = new ScriptTemplate(template);
        var actual = eng.run({});

        expect(actual).toBe(expected);
    });

    it("simple one each", function () {
        var template = "__each__ names __name__\r\n";

        var data = { names: [{ name: "John" }] };

        var expected = "John\r\n";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("simple two each", function () {
        var template = "__each__ names __name__";

        var data = { names: [{ name: "John" }, { name: "Sam" }] };

        var expected = "John\r\nSam\r\n";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("simple two each with comments", function () {
        var template = "/* __each__ names */ __name__";

        var data = { names: [{ name: "John" }, { name: "Sam" }] };

        var expected = "John\r\nSam\r\n";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("complex two each with comments", function () {
        var template = "this is before\r\n" + "/* __each__ names */ __name__\r\n" + "this is after.";

        var data = { names: [{ name: "John" }, { name: "Sam" }] };

        var expected = "this is before\r\n" + "John\r\nSam\r\n" + "this is after.";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("complex three each with comments and commas", function () {
        var template = "this is before\r\n" + "/* __each__ names, */ __name__\r\n" + "this is after.";

        var data = { names: [{ name: "John" }, { name: "Sam" }, { name: "George" }] };

        var expected = "this is before\r\n" + "John,\r\nSam,\r\nGeorge\r\n" + "this is after.";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("simple data", function () {
        var template = "Hello __who__!";

        var data = { who: "World" };

        var expected = "Hello World!";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("multiple data", function () {
        var template = "Hello __who__! __greeting__";

        var data = { who: "World", greeting: "How are you?" };

        var expected = "Hello World! How are you?";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("data and each together", function () {
        var template = "Hello __who__!\r\n" + "this is before\r\n" + "/* __each__ names */ __name__\r\n" + "this is after.";

        var data = { who: "World", names: [{ name: "John" }, { name: "Sam" }] };

        var expected = "Hello World!\r\n" + "this is before\r\n" + "John\r\nSam\r\n" + "this is after.";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("ignores, each, and data", function () {
        var template = "Hello __who__!\r\n" + "/* __ignore__ */ ignore me\r\n" + "__ignore__ and ignore me\r\n" + "/*__ignore__*/ ignore me\r\n" + "this is before\r\n" + "/* __each__ names */ __name__\r\n" + "this is after.";

        var data = { who: "World", names: [{ name: "John" }, { name: "Sam" }] };

        var expected = "Hello World!\r\n" + "this is before\r\n" + "John\r\nSam\r\n" + "this is after.";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("simple block each", function () {
        var template = "__startEach__ names\r\n" + "__name__\r\n" + "__endEach__";

        var data = { names: [{ name: "John" }] };

        var expected = "John\r\n";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("simple block each with comment", function () {
        var template = "/*__startEach__ names*/\r\n" + "__name__\r\n" + "/*__endEach__*/";

        var data = { names: [{ name: "John" }] };

        var expected = "John\r\n";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("simple block each with comment and space before", function () {
        var template = "\r\n\r\n/*__startEach__ names*/\r\n" + "__name__\r\n" + "/*__endEach__*/";

        var data = { names: [{ name: "John" }] };

        var expected = "\r\nJohn\r\n";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("simple function", function () {
        var template = "Hello __who__!";

        var data = { who: function () {
                return "World";
            } };

        var expected = "Hello World!";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });

    it("context function", function () {
        var template = "Hello __who__!";

        var data = { name: "World", who: function () {
                return this.name;
            } };

        var expected = "Hello World!";

        var eng = new ScriptTemplate(template);

        var actual = eng.run(data);

        expect(actual).toBe(expected);
    });
});
//# sourceMappingURL=index.js.map
