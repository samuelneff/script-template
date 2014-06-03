script-template
===============

Simple template engine specifically designed to generate JavaScript, TypeScript, or CoffeeScript where the templates themselves are also valid JS/TS/CS files.

Features
===

* Replace placeholders with values from supplied data
* Simple single-line loop for arrays
* Block-loop for repeated blocks
* Ignore lines that are in the template but should be excluded from output

Example
===

The following TypeScript template is used to generate classes for database tables. It is also valid TypeScript.

```TS
/* __each__ idFields */ enum __fieldName__ { none }

/*__ignore__*/ interface __translatedFieldType__ {}

/*__startEach__ tables */
interface __tableName__
{
    /*__each__ fields */ __fieldName__:__translatedFieldType__;
}
/*__endEach__*/
```

Note the comments are optional if you don't care about the template itself being optional. The following works as well:

```TS
__each__ idFields enum __fieldName__ { none }

__ignore__ interface __translatedFieldType__ {}

__startEach__ tables
interface __tableName__
{
    __each__ fields __fieldName__:__translatedFieldType__;
}
__endEach__
```


