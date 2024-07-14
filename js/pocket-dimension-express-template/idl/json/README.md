Json-Schema Templates

This directory contains json-schema definitions for use in the node server. The intent is to allow for a definition language that's legible and editable for all developers on the evictorbook project.

json-schema has two core advantages over a separate schema-definition language like protocol buffers. First, it's designed to have one-to-one compatibility with everything that can be expressed in json (in contrast to the protocol buffers schema language, which has some unfortunate edge-cases in json intercompatibility). Second, the definitions are represented in the specification as json descriptions, so it doesn't require any additions to the toolchain other than a validation library. We've opted for Ajv, the most widely-supported json-schema validator in the javascript language.

Problems with json-schema: There is a proliferation of draft specifications, and many features are not widely supported across validation libraries. The json format does not natively support inline comments, so it's very difficult to write effective annotations for schema definitions. Most damagingly, schema definitions are difficult to re-use: while the specification offers some support for schema re-use across files, the syntax is cumbersome and error-prone, and not uniformly supported.

To work around these challenges, we've opted to specify our json-schema definitions in the form of .js files. Each .js file is a commonjs module that exports a single object literal which represents a json-schema.

This means we can easily write in-line comments, and we can take advantage of javscript's built-in mechanisms for cross-file inclusion. Individual object schemas are defined in their own .js files so they can be re-used. To include a nested schema, simply call `require(<"filename">)` inline.

Avoid using `definitions` and `$ref` in the json-schema literals; these won't translate well when included in other files. Instead, rely on `require` as described above.

These schema definitions can be directly used in Node with either `require` or `import` syntax.

To resolve one of these schemas and all its imports to json (for example, to use in a json-schema validator in another language), run the following from the command line:

`node compile2json.js <filename> > outfile.json`

Note that you'll lose the inline js comments and any manual formatting from the original definitions.
