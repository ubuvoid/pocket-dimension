# framework

Pocket Dimension: Utilities for writing simple and effective Node Express servers.

=========

Motivation:

Node and Express constitute an impressive framework for backend server scripting, but they're missing certain conveniences, and those gaps led to the design of this library. This library has its origins in a project I contributed to beginning in the summer of 2020. I wrote these utility functions to enable the project to migrate its Node backend from prototype to production. With the kind permission of my collaborators, I've ported these utilities to their own repository for release as an independent project.

Features:

- Affordances to validate plain JS objects against json-schema or proto schemas. Useful for validating REST payloads and objects parsed from JSON blobs or serialized protocol buffers.
- Utilities for writing modular, stateless Express REST handlers with support for dependency injection through the app.locals api (analogous to 'context' in other systems).
- Safe and readable debug flag access through env variables, well suited for use in container environments.
- Mock express app harness for testing.
- Thrift-style service interfaces.
