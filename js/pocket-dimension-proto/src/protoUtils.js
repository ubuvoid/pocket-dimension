// protoUtils.js
//
// Functions for checking types with protocol buffers, via Pbf proto modules.
// Tested with one-offs and prototypes, but may need additional review before
// production use.

var RecursiveDiff = require('recursive-diff')
var path = require('path')
var resolve = require('resolve-protobuf-schema')
var Pbf = require('pbf')
var compile = require('pbf/compile')

// Resolves dependencies and compiles a protocol buffer schema from a .proto file.
// Heavily inspired by the mapbox pbf compiler cli:
// https://github.com/mapbox/pbf/blob/master/bin/pbf
//
// Note that the filename provided must be presented relative to the root
// directory of the project.
//
// ex: if proto schema is in '<app_root>/schemas/proto/', then you should
// provide 'schemas/proto/example.proto', *NOT* the relative path from your js
// file such as '../../schemas/proto/example.proto or similar.
//
// This is due to implementation details of node's 'resolve-protobuf-schema'.
var compileProto = function(filename) {
  var filepath = path.resolve(filename)
  return compile(resolve.sync(filepath))
}

// given a plain obj and a Pbf proto description, encode that obj as a proto
// and then reinflate it to a new plain object. new object is a deep copy; the
// original object is untouched.
//
// the new object is a deep copy of the original except:
//    - unrecognized properties are discarded.
//    - matching properties are retained.
//    - unset properties are intialized with their default proto values.
//
// throws err if things go wrong.
var encodeAndReinflate = function(protoDesc, obj) {
  try {
    var pbf = new Pbf()
    protoDesc.write(obj, pbf)
    var finished_buffer = pbf.finish()
    var refilledPbf = new Pbf(finished_buffer)

    return protoDesc.read(refilledPbf)
  } catch (err) {
    console.error("encodeAndReinflate err: " + err)
    throw "couldn't write/read obj. invalid proto description?"
  }
}

// given a Pbf module proto description, create a plain obj with properties
// initialized to the fieldnames and default values of that proto.
//
// throws err if things go wrong.
var emptyObjFromProto = function(protoDesc) {
  try {
    return protoDesc.read(new Pbf())
  } catch (err) {
    console.error("emptyObjFromProto err: " + err)
    throw "couldn't read proto. invalid proto description?"
  }
}

// check if a plain obj conforms to a Pbf module proto description.
//
// if the object conforms to proto, we return nothing (undefined).
// if the object doesn't conform to proto, or can't be verified, throws err.
//
// rules for conformance:
//   - all obj's properties must have a name and type that matches a
//       correponding field in the proto message definition.
//   - no extraneous properties may be set.
//   - obj is allowed to have missing/unset properties (exception: fields
//       marked 'required' in proto must be set. don't do this -- use of
//       required fields in proto is STRONGLY discouraged.)
//   - obj properties may be set to default values that correspond to their
//     default values. (strings can be '', objects can be null, booleans can be
//     false, int's can be 0, etc.  (assuming default proto3 semantics)).
//   - if opts.allow_null_for_default is set true, allow 'null' to stand in for
//     a field's default value.
//  protos are checked recursively, so embedded message field obj's must also
//  pass checks for their proto defs, and so on for embedded message fields of
//  those obj's.
//
// example usage:
//   try {
//     checkProto(MyProto.SomeMessage, obj);
//   } catch (err) {
//     console.log("type error, failed proto check: " + err);
//     return;
//   }
var checkProto = function(protoDesc, obj, opts={}) {
  try {
    // generate another plain object by encoding and reinflating obj as
    // proto. the result will have the following properties:
    //   1. field names and default values set;
    //   2. fields populated in obj remain populated;
    //   3. extraneous fields not part of proto definition are removed.
    var reinflated = encodeAndReinflate(protoDesc, obj);  // might throw.

    // getDiff returns a list of all differences found. empty list means the
    // two objects are deeply equal. the objects are compared 'left to right',
    // order of arguments is important because diff returns more info about
    // additions than deletions.
    //
    // allowed diffs (comparing reinflated ---> obj):
    //   'deleted' paths: ok. any properties missing from 'obj' were added
    //     during reinflate, so they are proto default values.
    //   'added' paths: unrecognized properties, never allowed.
    //      TODO: consider adding an option for non-strict comparison, allowing
    //      extra properties.
    //   'updated' paths: valid path name, but value was rejected by proto.
    //     allow only when the obj value is equivalent to the proto default (ex:
    //     null instead of '' for a string value).
    var diff = RecursiveDiff.getDiff(reinflated, obj)

    // debugging: set true to enable verbose logging for debugging.
    // set back to false before submitting.
    if (false) {
      console.log("DEBUG: obj " + JSON.stringify(reinflated))
      console.log("DEBUG: reinflated " + JSON.stringify(reinflated))
      console.log("DEBUG: diff " + JSON.stringify(diff))
    }

    for (var diff_ind in diff) {
      var d = diff[diff_ind]
      if (d.op === "delete") {
        continue
      }
      else if (d.op === "update") {
        // context: neo4j driver objects have null for unset strings, while
        // proto string fields default to '', so we allow null as a proxy for
        // proto defaults.
        // TODO: Add configuration options for null behavior.
        if (opts.allow_null_for_default && d.val === null) {
          continue
        }
        // otherwise...
        throw "unexpected value: " + d.val + " at path: " +
          JSON.stringify(d.path)
      }
      else if (d.op === "add") {
        throw "unexpected property path: " + JSON.stringify(d.path)
      }
    }
    // nothing to return.
  } catch (err) {
    console.error("checkProto err: " + err)
    throw err;
  }
}

// Returns a validator function, to be used with the pocket-dimension service
// interface. The returned function takes one plain obj parameter, and returns
// true if the obj conforms to the protocol buffer schema expressed by the
// pbfEncoder obj, false otherwise. Never throws.
var buildPbfValidatorFn = function(pbfEncoder) {
  return function(obj) {
    try {
      checkProto(pbfEncoder, obj)
    } catch (err) {
      return false
    }
    return true
  }
}

module.exports = {
  compileProto,
  checkProto,
  emptyObjFromProto,
  encodeAndReinflate,
  buildPbfValidatorFn
}
