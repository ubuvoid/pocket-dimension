JTD Schemas

Shows how to use JSON Typedef schemas to validate REST payloads. We're writing the schemas in JavaScript to make use of comments and includes, in CommonJS modules that export a JSON-compatible object that represents a JTD Schema.

These can be imported directly from Node, or parsed from JSON.

```
# Compile JTD definitions to JSON:
$ node compile2json.js ./foo_service.jtd.cjs > generated/foo_service.jtd.json

# Run jtd-codegen to generate cross-language validation and serialization code:
$ cat generated/foo_service.jtd.json | jtd-codegen - --root-name FooService --python-out generated/gen_py/foo_service --go-package foo_service_jtd --go-out generated/gen_golang/foo_service --typescript-out generated/gen_ts/foo_service
```
