// mockApp.js
//
// Helper functions useful for testing rest listeners.

// Creates fake versions of the express app objects, to serve as harness for
// rest listeners under test.
const expressMocks = function() {
  // Placeholder obj for mocks to store info from code under test (response
  // values, other internal details) so they can be verified by unit tests.
  //   usage:
  //     var mocks = mockUtils.expressMocks()
  //     mocks.req.app.locals.queryHandlers["label"] = fakeQueryHandler
  //     await restListenerUnderTest(mocks.req, mocks.resp)
  //
  //     // now, you can assert() to validate response.
  //     var actualResponse = JSON.parse(mocks.actuals.response_body)
  //     assert(...)
  //
  // NOTE: Handler callbacks may set additional properties here, when invoked,
  // to pass detailed information back to test harness for assertions (verify
  // parsing of input params, etc.)
  const actuals = {
    response_body: "",          // set on resp.json() or resp.send()
    response_finalized: false,  // set true on resp.json() or resp.send()
    response_code: 200          // set on resp.status()
  }

  // Mock request obj, to be sent to the code under test to simulate request
  // parameters and app locals.
  // Callers can add additional properties to this object to provide support
  // for mocking other features of the express API. 
  const req = {
    // caller should set route params here for code under test.
    params: {},
    // mock app context. express presents the 'app' obj to callers as a
    // property of 'req'. we take advantage of this to inject dependencies
    // and flags into listeners under test.
    app: {
      locals: {
        // Callers can add properties here in order to pass information or
        // callbacks to the handler code. The structure of the 'locals' object
        // you use in your mockApp should match the one passed to handlers in
        // the production app.
      }
    }
  }

  // Mock response obj, to be sent to code under test.
  // Callers can add additional properties to this object to provide support
  // for mocking other features of the express API. 
  const resp = {
    // Mock 'json' function, writes stringified obj to actuals.
    json: function(response_obj) {
      if (actuals.response_finalized) { throw 'redundant json() call!' }
      actuals.response_body = JSON.stringify(response_obj)
      actuals.response_finalized = true
      return resp
    },
    // Mock 'send' function, writes response body string to actuals.
    send: function(response_body) {
      if (actuals.response_finalized) { throw 'redundant send() call!' }
      actuals.response_body = response_body
      actuals.response_finalized = true
      return resp
    },
    // Mock 'status' function, writes given http status code to actuals.
    status: function(code) {
      if (actuals.response_finalized) { throw 'redundant status() call!' }
      actuals.response_code = code
      return resp
    }
  }

  return {
    actuals: actuals,
    req: req,
    resp: resp
  }
}

module.exports = {
  expressMocks
}
