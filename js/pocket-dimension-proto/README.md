pocket-dimension-proto

Proof-of-concept library for validating json-compatible objects with protocol buffer schemas.

Not tested for production use, but suitable for demos and one-off tasks.

Note on the choice of protocol buffer library: We opted for simplicity in the protocol buffers integration, and chose to rely on a small but heavily production-tested library called 'pbf'.

Note, however, that as a result of this design choice, the json representation that's being validated is equivalent to the way the Pbf library deserializes protocol buffers to json-compatible objects. This leads to certain edge cases, for examplearound the representation of enums and implementation details of union fields.

As an alternative, one could rely on the officially supported protocol buffers library or protobufjs as a validation library, if you're willing to take on the additional dependencies.
