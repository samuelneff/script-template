var ScriptTemplate = (function () {
    function ScriptTemplate(source) {
        this.source = source;
        this.source = this.runIgnores(source);
    }
    ScriptTemplate.prototype.run = function (data) {
        if (data == null) {
            return "";
        }

        var result = this.source;
        result = this.runBlockEach(result, data);
        result = this.runEach(result, data);
        result = this.runData(result, data);
        return result;
    };

    ScriptTemplate.prototype.runIgnores = function (source) {
        //
        // matches
        //
        //    /*__ignore__*/ .. to end of line ..
        //
        var re = new RegExp("(\\r\\n|\\r|\\n)?[ \t]*(/\\*[ \t]*)?__ignore__[^\\r\\n]+(\\r\\n|\\r|\\n)?", "g");

        function replaceIgnore(match, eol1) {
            return eol1 === undefined ? "" : eol1;
        }

        return source.replace(re, replaceIgnore);
    };

    ScriptTemplate.prototype.runBlockEach = function (source, data) {
        //
        // matches
        //
        //    /*__startEach__ tables */
        //        .. content here, many lines
        //    /*__endEach__*/
        //
        // block eaches cannot be nested (but line each can be inside block each
        var re = new RegExp("(?:\\r\\n|\\r|\\n)?[ \t]*(?:/\\*)?[ \t]*__startEach__[ \t]*(\\w+)[ \t]*(?:\\*/)?[ \t]*(?:\\r\\n|\\r|\\n)((.*?|\\r\\n|\\r|\\n)+?)(?:/\\*)?[ \t]*__endEach__[ \t]*(?:\\*/)?(?:\\r\\n|\\r|\\n)?", "g");

        var scriptTemplate = this;

        function replaceBlockEach(match, name, content) {
            var values = data[name];

            if (values == null || values.length == 0) {
                return "";
            }

            var results = [];

            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                var text = scriptTemplate.runEach(content, value);
                text = scriptTemplate.runData(text, value);
                results.push(text);
            }

            return results.join("");
        }

        return source.replace(re, replaceBlockEach);
    };

    ScriptTemplate.prototype.runEach = function (source, data) {
        //
        // matches
        //
        //    /*__each__ fields */ .. to end of line ..
        //
        var re = new RegExp("(\\r\\n|\\r|\\n)?([ \t]*)(?:/\\*)?[ \t]*__each__[ \t]*(\\w+)[ \t]*(?:\\*/)?[ \t]*([^\\r\\n]+)(\\r\\n|\\r|\\n)?", "g");

        var scriptTemplate = this;

        function replaceEach(match, eol1, spaceBefore, name, content, eol2) {
            var values = data[name];

            if (values == null || values.length == 0) {
                return "";
            }

            var results = [];

            for (var i = 0; i < values.length; i++) {
                results.push(scriptTemplate.runData(content, values[i]));
            }

            if (eol1 === undefined) {
                eol1 = "";
            }
            if (spaceBefore == undefined) {
                spaceBefore = "";
            }
            if (eol2 === undefined) {
                eol2 = "\r\n";
            }
            return eol1 + spaceBefore + results.join(eol2 + spaceBefore) + eol2;
        }

        return source.replace(re, replaceEach);
    };

    ScriptTemplate.prototype.runData = function (source, data) {
        var re = new RegExp("__(\\w+)__", "g");

        function replaceValue(match, name) {
            var value = data[name];

            // .call() syntax is needed to maintain context
            return typeof (value) == 'function' ? value.call(data, data) : data[name];
        }

        return source.replace(re, replaceValue);
    };
    return ScriptTemplate;
})();

module.exports = ScriptTemplate;
//# sourceMappingURL=index.js.map
