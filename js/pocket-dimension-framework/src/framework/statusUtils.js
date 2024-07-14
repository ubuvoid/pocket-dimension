// statusUtils.js

// Creates a 'status' object used to represent a successful call.
const okStatus = function() {
  return { code: 200 }
}

// Creates a 'status' object used to represent an error case, with a numeric
// code and an optional string message.
const errorStatus = function(code, message) {
  if (!Number.isInteger(code)) {
    throw "expected integer code, found: " + code
  }

  if (message && typeof message !== "string") {
    throw "expected string message, found: " + message
  }

  const ret = { code: code }
  if (message) {
    ret.message = message
  }
  return ret
}

// Creates a 'status' object representing 'Bad Request' (code 400), with an
// optional string message.
const badRequestStatus = function(message) {
  if (!message) { message = "BAD_REQUEST" }
  return errorStatus(400, message)
}

// Creates a 'status' object representing 'Internal Error' (code 500), with an
// optional string message.
const internalErrorStatus = function(message) {
  if (!message) { message = "INTERNAL_ERROR" }
  return errorStatus(500, message)
}

// Creates a 'status' object representing 'Not Implemented' (code 501), with an
// optional string message.
const notImplementedStatus = function(message) {
  if (!message) { message = "NOT_IMPLEMENTED" }
  return errorStatus(501, message)
}

// Returns true if the status obj represents an 'OK' status, false otherwise.
const isStatusOk = function(status) {
  if (!status) return false
  return status.code === 200
}

module.exports = {
  okStatus,
  errorStatus,
  badRequestStatus,
  internalErrorStatus,
  notImplementedStatus,
  isStatusOk
}
