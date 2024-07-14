module.exports = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  title: "Envelope",
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "string", "enum": ["UNKNOWN", "GREETING"], default: "GREETING" }, // enum as string, for readability.
    name: { type: "string", default: "test" },
    flag: { type: "boolean", default: true  },
    weight: { type: "number", default: 1.5 },  // TODO: we don't have a way to specify this should be serialized elsewhere as 32-bits, gonna have to deal.
    id: { type: "integer", default: 1 },
  }
}

