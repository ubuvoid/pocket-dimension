// serviceUtils.js
var statusUtils = require('./statusUtils')

// Invokes a local service call without explicit type-checking.
// never throws.
//
// - app is the express 'app' object, or an object that mocks it.
// - handlerFn is a function which takes (app, request_data, response_data),
//     populates response_data, and returns a status object, of the type
//     created by the helper methods in ./statusUtils.js
// - request_data is a plain object representing the request data payload. it
//     should conform to the protocol of the RPC's "Request" message.
// - response_data, if supplied, will be passed in to handlerFn and used to
//     contain the data payload of the response. it is the same object which
//     appears in the 'data' property of the return value.
const invokeFlexibleLocalRpcHandler = async function(
    app, handlerFn, request_data, response_data = {}) {
  let response_status  // to contain status, error codes, etc.
  try {
    response_status = await handlerFn(app, request_data, response_data)
  } catch (err) {
    // TODO: Do something less hokey for error handling.
    console.error("error invoking local service: ", err)
    return { info: { status: statusUtils.internalErrorStatus() } }
  }

  // if the invocation was successful, return response_data directly (no wrapper).
  // (if rpcHandler returned nothing, assume status 'OK'.)
  if (!response_status) {
    return { data: response_data, info: { status: statusUtils.okStatus() }  }
  }
  if (statusUtils.isStatusOk(response_status)) {
    return { data: response_data, info: { status: response_status }  }
  }

  // if we're here, the handler fn returned an obj that's not an 'OK' status.
  if (!Number.isInteger(response_status.code)) {
    // malformed response status, return INTERNAL_ERROR.
    console.error("error invoking local service. malformed response status: " +
      JSON.stringify(response_status))
    return { info: { status: statusUtils.internalErrorStatus() } }
  }

  // handler returned a well-formed status representing an error. wrap and
  // return it to the caller.
  return { info: { status: response_status } }
}

// Invoke a local rpc handler, and confirm that the input and output payloads
// return 'true' when passed to their respective validator functions (if present).
//
// Throws an error if either the passed-in request_data or the populated
// response_data breaks from the expected message protocol.
const invokeLocalRpcHandler = async function(
    app, handlerFn, request_validator_fn, response_validator_fn,
    request_data, response_data = {}) {
  // Ensure that the request_data conforms to expected schema.
  // Assumes ajv-style validators, where validation failures are kept in an
  // 'errors' property of the validator function.
  if (request_validator_fn) {
    try {
      if (!request_validator_fn(request_data)) {
        console.error("Request validation failure: ",
                      request_validator_fn.errors)
        return { info: { status: statusUtils.badRequestStatus() } }
      }
    } catch (err) {
      // Encountered an exception when attempting to validate.
      console.error("Request validation error: ", err)
      return { info: { status: statusUtils.internalErrorStatus() } }
    }
  }

  const result = await invokeFlexibleLocalRpcHandler(
      app, handlerFn, request_data, response_data)

  // When the call is successful, result.data refers to the exact same object
  // as response_data. TODO: This is a terrible hack; reconsider.
  if (result.data == response_data) {
    if (response_validator_fn) {
      try {
        if (!response_validator_fn(response_data)) {
          console.error("Response validation failure: ",
                        response_validator_fn.errors)
          return { info: { status: statusUtils.internalErrorStatus() } }
        }
      } catch (err) {
        // Encountered an exception when attempting to validate.
        console.error("Response validation error: ", err)
        return { info: { status: statusUtils.internalErrorStatus() } }
      }
    }
    return { data: result.data, info: { status: statusUtils.okStatus() } }
  }

  // If we're here, assumme we're in the error case. If the result object
  // already represents an appropriately-formatted error wrapper, we can return
  // it. Otherwise, we'll build one that represents an internal error.
  if (!result.info
      || !result.info.status
      || !result.info.status.code) {
    // error obj was malformed, return an INTERNAL_ERROR instead.
    console.error("error invoking local service (type-safe). malformed response status: " +
      JSON.stringify(response_status))
    return { info: { status: statusUtils.internalErrorStatus() } }
  }

  // if we're here, the call invocation returned a well-formed error wrapper
  // obj. return it to the caller.
  return result
}

// Invokes a service call locally, based on the info in the passed-in service
// obj. If the service obj contains request and response validator functions,
// then request and response object schemas are enforced at call-time.
//
// Example usage:
//   const result = await serviceUtils.invokeLocalServiceCall(
//       app, sampleService, "SampleDatabaseEntityIndexSearch", request_data)
//   if (!serviceUtils.isResultOk(result)) {
//     // bad. throw error.
//   }
//   doSomething(result.data)
const invokeLocalServiceCall = async function(
    app, service, methodName, request_data, response_data = {}) {
  return invokeLocalRpcHandler(
    app,
    service.handlers[methodName],
    service.requestValidators[methodName],
    service.responseValidators[methodName],
    request_data, response_data)
}

// To be called during app setup. Sample usage:
//
// const service = {}
// serviceUtils.registerHandlerCallback(
//   service, "ExampleIndexSearch", exampleSearchFn,
//   exampleSearchRequestValidatorFn, exampleSearchResponseValidatorFn)
// // and so on for other methods on the service....
//
// request_validator_fn and request_encoder_fn are functions which will be
// invoked with a single plain obj parameter, the request_data or response_data
// of a service call (respectively).
//
// If supplied, the validator functions must return a boolean -- true if the
// data passes validation, false otherwise.
//
// To generate a flexible (non-type-safe) service handler, invoke this function
// without specifying request_validator_fn or response_validator_fn.
const registerHandlerCallback = function(service, methodName, handlerFn,
    request_validator_fn = null, response_validator_fn = null) {
  if (!methodName || typeof methodName !== "string") {
    throw "expected non-empty string methodName, found: " + methodName
  }
  if (!service.handlers) { service.handlers = {} }
  if (!service.requestValidators) { service.requestValidators = {} }
  if (!service.responseValidators) { service.responseValidators = {} }

  // TODO: Set these in such a way that they can't be overwritten.
  service.handlers[methodName] = handlerFn
  if (request_validator_fn) {
    service.requestValidators[methodName] = request_validator_fn
  }
  if (response_validator_fn) {
    service.responseValidators[methodName] = response_validator_fn
  }
}


// Given a result value returned from an 'invoke' function above, return true
// if the result contains a payload from a successful call.
// Return false otherwise.
const isResultOk = function(result) {
  if (!result) return false
  if (typeof result !== "object") return false

  // TODO: Add more explanation here.
  if (typeof result.data === "object") {
    return true
  }
  if (typeof result.info === "object" && 
    statusUtils.isStatusOk(result.info.status)) {
    return true
  }

  return false
}

// Returns a convenient object wrapper for the service functionality defined
// above, to provide a terser syntax for callers.
//
// Usage:
// During application setup:
//   const handler = serviceUtils.buildServiceHandler("FooService")
//   handler.registerCallback("Method1", method1Handler, ...)
//   
// Later:
//   const result = await handler.invoke(app, "Method1", request_data)
//   if (serviceUtils.isResultOk(result)) {
//     // result.data contains the response_data set by the handler callback.
//     doSomething(result.data)
//   } else {
//     // Either handle error, or throw an exception.
//     // result.info.status contains info about what went wrong.
//   }
const buildServiceHandler = function(serviceName) {
  return {
    name: serviceName,
    invoke: function(app, methodName, request_data, response_data) {
      return invokeLocalServiceCall(app, this, methodName, request_data, response_data)
    },
    registerCallback: function(
        methodName, handlerFn, request_validator_fn, response_validator_fn) {
      return registerHandlerCallback(
        this, methodName, handlerFn, request_validator_fn, response_validator_fn)
    }
  }
}

module.exports = {
  invokeFlexibleLocalRpcHandler,
  invokeLocalRpcHandler,
  invokeLocalServiceCall,
  registerHandlerCallback,
  isResultOk,
  buildServiceHandler
}
