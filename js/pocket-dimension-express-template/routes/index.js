// Built upon template generated with express-generator.
// Status: draft.

var express = require('express');
var app = express();

var pocket = require('pocket-dimension-framework');
var pocketProto = require('pocket-dimension-proto');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* GET home page. */
app.get('/', function(req, res, next) {
  // TODO: Update this template with something specific, like directions for
  // how to query an example rest endpoint.
  res.render('index', { title: 'Pocket Dimension Example' });
});


// Endpoint for an example REST service.
const serviceHandler = pocket.serviceUtils.buildServiceHandler("FooService");

// Build validator from idl definition (can also be generated and checked in).
const fooPbf = pocketProto.protoUtils.compileProto("idl/proto/foo_service.proto");

// TODO Write actual method handler, populate response_data, return okStatus().
const method1Handler = function (app, request_data, response_data) {
  return pocket.statusUtils.notImplementedStatus();
}

// TODO Generate validator functions from object schemas (IDL) and pass them in.
serviceHandler.registerCallback(
  "Method1", method1Handler,
  pocketProto.protoUtils.buildPbfValidatorFn(fooPbf.Method1Request),
  pocketProto.protoUtils.buildPbfValidatorFn(fooPbf.Method1Response));

// Post handler (request obj as json body)
app.post('/foo/method1', async function(req, res, next) {
  try {
    // local service calls are invoked async, to allow method handlers to make async calls as needed.
    const result = await pocket.serviceUtils.invokeLocalServiceCall(
      req.app, serviceHandler, "Method1", req.body);
    // If no error was thrown, result looks like:
    //  {
    //    data: {},  // contains response data as populated by the method handler. 
    //    info: {}   // contains status code and message. see statusUtils.js in pocket-dimension-framework.
    //  }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Error: " + error);
  }
});

module.exports = app;
