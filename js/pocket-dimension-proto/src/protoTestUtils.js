// protoTestUtils.js
//
// Test-specific functions for checking types with protocol buffers.

var assert = require('assert')
var protoUtils = require('./protoUtils')

// Assert that obj1 and obj2 are both valid protos, and that they represent
// equivalent proto messages.
//
// TODO: catch err's and assert, rather than throwing errs back to caller.
var assertProtoEquivalence = function(protoDesc, obj1, obj2) {
  // Verify obj's are valid as proto. (correct types, no extra fields).
  protoUtils.checkProto(protoDesc, obj1)
  protoUtils.checkProto(protoDesc, obj2)

  // Encode and reinflate, to standardize / add defaults.
  var reinflated1 = protoUtils.encodeAndReinflate(protoDesc, obj1)
  var reinflated2 = protoUtils.encodeAndReinflate(protoDesc, obj2)

  assert.deepStrictEqual(reinflated1, reinflated2);
}

module.exports = {
  assertProtoEquivalence
}
