
class ScriptTemplate
{
   constructor(public source:string)
   {
        this.source = this.runIgnores(source);
   }

   run(data:Object):string
   {
       if (data == null)
       {
           return "";
       }

       var result:string = this.source;
       result = this.runBlockEach(result, data);
       result = this.runEach(result, data);
       result = this.runData(result, data);
       return result;
   }

    private runIgnores(source:string):string
    {
        //
        // matches
        //
        //    /*__ignore__*/ .. to end of line ..
        //
        var re:RegExp = new RegExp("(\\r\\n|\\r|\\n)?[ \t]*(/\\*[ \t]*)?__ignore__[^\\r\\n]+(\\r\\n|\\r|\\n)?", "g");

        function replaceIgnore(match:string, eol1:string):string
        {
            return eol1 === undefined ? "" : eol1;
        }

        return source.replace(re, replaceIgnore);
    }

    private runBlockEach(source:string, data:Object):string
    {
        //
        // matches
        //
        //    /*__startEach__ tables */
        //        .. content here, many lines
        //    /*__endEach__*/
        //
        // block eaches cannot be nested (but line each can be inside block each

        var re:RegExp = new RegExp("(?:\\r\\n|\\r|\\n)?[ \t]*(?:/\\*)?[ \t]*__startEach__[ \t]*(\\w+)[ \t]*(?:\\*/)?[ \t]*(?:\\r\\n|\\r|\\n)((.*?|\\r\\n|\\r|\\n)+?)(?:/\\*)?[ \t]*__endEach__[ \t]*(?:\\*/)?(?:\\r\\n|\\r|\\n)?", "g");

        var scriptTemplate:ScriptTemplate = this;

        function replaceBlockEach(match:string, name:string, content:string):string
        {
            var values:Array<Object> = data[name];

            if (values == null || values.length == 0)
            {
                return "";
            }

            var results:Array<string> = [];

            for(var i:number = 0; i < values.length; i++) {
                var value:Object = values[i];
                var text:string = scriptTemplate.runEach(content, value);
                text = scriptTemplate.runData(text, value);
                results.push(text);
            }

            return results.join("");
        }

        return source.replace(re, replaceBlockEach);
    }

    private runEach(source:string, data:Object):string
    {
        //
        // matches
        //
        //    /*__each__ fields */ .. to end of line ..
        //
        var re:RegExp = new RegExp("(\\r\\n|\\r|\\n)?([ \t]*)(?:/\\*)?[ \t]*__each__[ \t]*(\\w+)[ \t]*(?:\\*/)?[ \t]*([^\\r\\n]+)(\\r\\n|\\r|\\n)?", "g");

        var scriptTemplate:ScriptTemplate = this;

        function replaceEach(match:string, eol1:string, spaceBefore:string, name:string, content:string, eol2:string):string
        {

            var values:Array<Object> = data[name];

            if (values == null || values.length == 0)
            {
                return "";
            }

            var results:Array<string> = [];

            for(var i:number = 0; i < values.length; i++) {
                results.push(scriptTemplate.runData(content, values[i]));
            }

            if (eol1 === undefined)
            {
                eol1 = "";
            }
            if (spaceBefore == undefined)
            {
                spaceBefore = "";
            }
            if (eol2 === undefined)
            {
                eol2 = "\r\n";
            }
            return eol1 + spaceBefore + results.join(eol2 + spaceBefore) + eol2;
        }

        return source.replace(re, replaceEach);
    }

    private runData(source:string, data:Object):string
    {
        var re:RegExp = new RegExp("__(\\w+)__", "g");

        function replaceValue(match:string, name:string):string
        {
            var value:any = data[name];

            // .call() syntax is needed to maintain context
            return typeof(value) == 'function' ? value.call(data, data) : data[name];
        }

        return source.replace(re, replaceValue);
    }
}

export = ScriptTemplate;