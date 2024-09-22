// JTD definition for an example REST service.
//
// Shows how to use JSON Typedef definitions to generate validators for REST
// payloads and other json-serialized data.

// Method1Request
const method1_request_jtd = {
  "properties": {
    "some_param": { "type": "string" },
    "another_param": { "type": "float64" }
  }
}

// Internal json definition to be used in Method1Response
const method1_response_data_point_jtd = {
  "properties": {
    "id": { "type": "string" },
    "value": { "type": "float64" }
  }
}

// Method1Response
const method1_response_jtd = {
  "properties": {
    "information": { "type": "string" },
    "fractional_score": { "type": "float64" },
    "small_integer_metadata": { "type": "int32" },
    "unsigned_small_int_metadata": { "type": "uint32" },
    // JSON numbers can't encode the full range of int64/uint64, so we encode
    // those values as strings.
    "bigger_unsigned_integer_metadata": { "type": "string" },
    "data_points": { "elements": method1_response_data_point_jtd }
  }
}

// Request-response pairs for the methods of FooService
const foo_service_jtd = {
  "discriminator": "method_name",
  "mapping": {
    "Method1": {
      "properties": {
        "request": method1_request_jtd,
        "response": method1_response_jtd
      }
    }
  }
}

module.exports = foo_service_jtd
