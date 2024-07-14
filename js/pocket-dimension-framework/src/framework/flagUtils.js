// flagUtils.js


// helper functions to read flags from env:

// safe way to read a boolean flag, passed to the app via env variable.
//
// inputs: string value of an env variable, and the intended default. return
// true if the string is "true", and false if the string is "false". otherwise,
// return the otherwise, return the default.
//
// recommended: prefer variables that default to false. they're safer.
//
// usage:
//    const debugFlag = readBooleanEnvFlag(process.env.ENV_VARIABLE, false)
//    if (debugFlag) {
//      // do something you don't normally do in production.
//    }
const readBooleanEnvFlag = function(envString, defaultValue = false) {
  if (envString === "true") { return true }
  if (envString === "false") { return false }
  return defaultValue
}

// safe way to read an integer flag, passed to the app via env variable.
//
// inputs: string value of the env variable, and the intended integer default.
// if the string can be parsed as an integer, return that integer value.
// otherwise, returns the default. ('' -> default, not zero.)
//
// usage:
//   const someParam = readIntegerEnvFlag(process.env.ENV_VARIABLE, 100)
//   if (someParam < 0) {
//     callSomeFunction(someParam)
//   }
const readIntegerEnvFlag = function(envString, defaultValue = 0) {
  var value
  if (!envString) {
    // return default if undefined/empty str is passed in...
    return defaultValue
  }
  value = Number(envString)
  if (!Number.isInteger(value)) {
    // ...or if the number is a non-integer.
    return defaultValue
  }
  return value
}

// safe way to read a string flag, passed into the app via env variable.
//
// inputs: the value of an env variable, as returned by process.env.MY_VARIABLE,
//  and an intended default value.
//
// usage:
//   const someValue = readStringEnvFlag(process.env.MY_VARIABLE, "tubular")
//
// this isn't as useful as the equivalent helper functions for boolean and
// number flags, but it's here for symmetry.
const readStringEnvFlag = function(envString, defaultValue = '') {
  return ( envString ? envString : defaultValue )
}

// internal helper function, check types and throw a well-formatted error if
// param_value's type doesn't match expected_typename.
//
// example usage:
//   checkParamType("flags", flags, 'object')
//
// if 'print_value' is true, include param_value's value in the error msg.
// if 'check_nonfalse' is true, also throw on 'if (!param_value)'.
const checkParamType = function(
    param_name, param_value, expected_typename,
    print_value = true, check_nonfalse = false) {
  if (typeof param_value !== expected_typename) {
    throw 'invalid ' + param_name + ',' + 
        ' expected ' + expected_typename + ',' +
        ' found: ' + typeof param_value +
        ( (print_value) ? (', value: ' + param_value) : '' )
  }
  if (check_nonfalse && (!param_value)) {
    throw 'invalid ' + param_name + ',' + 
        ' expected non-falsey ' + expected_typename + ',' +
        ' found: ' + typeof param_value +
        ( (print_value) ? (', value: ' + param_value) : '' )
  }
}

// safely read and store a boolean flag, passed to the app via env variable.
//
// inputs:
//   flags: object. value will be stored as a property of this obj.
//   flagName: a name for your flag. access the value later at flags.flagName.
//   envString: the string-value of an environment variable to process, as
//       retrieved with 'process.env.ENV_VARIABLE'.
//   defaultValue: if supplied, the boolean value to use by default.
//
// example usage:
//   // in app setup...
//   const flags = {}
//   defineBooleanEnvFlag(flags, 'myFlag', process.env.MY_ENV_VARIABLE, false)
//
//   // ... later ...
//   if (flags.myFlag) {
//     // do something you don't normally do in production.
//   }
const defineBooleanEnvFlag = function(
    flags, flagName, envString = '', defaultValue = false) {
  checkParamType('flags', flags, 'object')
  checkParamType('flagName', flagName, 'string', true, true)
  checkParamType('envString', envString, 'string', true, false)
  checkParamType('defaultValue', defaultValue, 'boolean')

  Object.defineProperty(flags, flagName, {
    value: readBooleanEnvFlag(envString, defaultValue),
    writable: false
  })
}

// safely read and store an integer flag, passed to the app via env variable.
//
// inputs:
//   flags: object. value will be stored as a property of this obj.
//   flagName: a name for your flag. access the value later at flags.flagName.
//   envString: the string-value of an environment variable to process, as
//       retrieved with 'process.env.ENV_VARIABLE'.
//   defaultValue: if supplied, the integer value to use by default.
//
// example usage:
//   // in app setup...
//   const flags = {}
//   defineIntegerEnvFlag(flags, 'myParam', process.env.MY_ENV_VARIABLE, 192)
//
//   // ... later ...
//   const someParam = flags.myParam  // default: 192.
//   if (someParam < 0) {
//     callSomeFunction(someParam)
//   }
const defineIntegerEnvFlag = function(
    flags, flagName, envString = '', defaultValue = 0) {
  checkParamType('flags', flags, 'object')
  checkParamType('flagName', flagName, 'string', true, true)
  checkParamType('envString', envString, 'string', true, false)
  checkParamType('defaultValue', defaultValue, 'number')

  if (!Number.isInteger(defaultValue)) {
    throw 'bad default value, expected integer, got: ' + defaultValue
  }

  Object.defineProperty(flags, flagName, {
    value: readIntegerEnvFlag(envString, defaultValue),
    writable: false
  })
}

// safely read and store a string flag, passed to the app via env variable.
//
// inputs:
//   flags: object. value will be stored as a property of this obj.
//   flagName: a name for your flag. access the value later at flags.flagName.
//   envString: the string-value of an environment variable to process, as
//       retrieved with 'process.env.ENV_VARIABLE'.
//   defaultValue: if supplied, the string value to use by default.
//
// example usage:
//   // in app setup...
//   const flags = {}
//   defineStringEnvFlag(flags, 'myFlag', process.env.MY_ENV_VARIABLE, 'mondo')
//
//   // ... later ...
//   if (flags.myFlag !== "mondo") {
//     // do something you don't normally do in production.
//   }
const defineStringEnvFlag = function(
    flags, flagName, envString = '', defaultValue = '') {
  checkParamType('flags', flags, 'object')
  checkParamType('flagName', flagName, 'string', true, true)
  checkParamType('envString', envString, 'string', true, false)
  checkParamType('defaultValue', defaultValue, 'string')

  Object.defineProperty(flags, flagName, {
    value: readStringEnvFlag(envString, defaultValue),
    writable: false
  })
}

module.exports = {
  readBooleanEnvFlag,
  readIntegerEnvFlag,
  readStringEnvFlag,
  defineBooleanEnvFlag,
  defineIntegerEnvFlag,
  defineStringEnvFlag
}
