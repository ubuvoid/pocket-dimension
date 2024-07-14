// compile2json.js
//
// Reads a filename from the command line, interprets it as a module which
// exports a json-compatible object, and writes it as pretty-printed json to
// standard out.
//
// Used to "compile" .js object definitions to json.
const fs = require("fs")

const filename = process.argv[2]
const resolved = require(filename)

// The additional parameters cause the json string to be pretty-printed with an
// indent of 2 spaces. Remove them for a more compact single-line json.
console.log(JSON.stringify(resolved, null, 2))
