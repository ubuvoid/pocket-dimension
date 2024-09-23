// Built upon template generated with express-generator.
// Status: draft.

const express = require('express');
const pocket = require('pocket-dimension-framework');

// For json payload validation.
const Ajv = require('ajv/dist/jtd');
const ajv = new Ajv();

// General Express setup:
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// GET home page
app.get('/', function(req, res, next) {
  // TODO: Update this template with something specific, like directions for
  // how to query an example rest endpoint.
  res.render('index', { title: 'Pocket Dimension Example' });
});

// Pocket Dimension setup:

// JTD schema definition, used to generate request and response validators.
// Recommended format (fill in "properties" for each request and response):
// {
//    "discriminator": "method_name",
//    "mapping": {
//      "SomeMethodName": {
//        "properties": {
//          "request": { "properties": { ... } },
//          "response": { "properties": { ... } }
//        }
//      },
//      "AnotherMethodName": {
//        "properties": {
//          "request": { "properties": { ... } },
//          "response": { "properties": { ... } }
//        }
//      }
//    }
// }
// Schemas can be parsed from json, or defined in code as a json-compatible
// object such as the one included here. To be validated with AJV.
const foo_service_jtd = require('../idl/jtd/foo_service.jtd.cjs');

// Endpoint for an example REST service.
const serviceHandler = pocket.serviceUtils.buildServiceHandler("FooService");

// Example method handler.
// Pocket Dimension passes in the Express 'app' to serve as a context, and for
// dependency injection via app.locals.
// The handler should return a status of the type created by pocket.statusUtils.
// request_data is the parsed REST request body.
// response_data is an object which should be updated to reflect the response.
const method1Handler = function (app, request_data, response_data) {
  const randomInt = function (span, offset = 0) {
    return Math.floor((Math.random() * span) + offset)
  }
  // Incorporate some info from the request, because it makes for a good demo.
  response_data.information = "amazing_" + request_data.some_param +  "_fact_" + randomInt(9999)
  response_data.fractional_score = request_data.another_param * Math.random()
  // The remaining fields are random.
  response_data.small_integer_metadata = randomInt(Math.pow(2,32), -(Math.pow(2,31)))
  response_data.unsigned_small_int_metadata = randomInt(Math.pow(2,32))
  response_data.bigger_unsigned_integer_metadata = randomInt(Math.pow(2,48)).toString()
  const num_points = randomInt(10)
  response_data.data_points = []
  for (let i = 0; i < num_points; i++) {
    response_data.data_points.push(
        {id: "factoid_" + randomInt(9999), value: Math.random() })
  }
  // This example handler always returns okStatus (200).
  // For error cases, handlers should create and return an appropriate
  // error status via statusUtils.
  return pocket.statusUtils.okStatus();
}

// Register callbacks, with AJV request and response validators.
serviceHandler.registerCallback(
  "Method1",
  method1Handler,
  ajv.compile(foo_service_jtd.mapping["Method1"].properties.request),
  ajv.compile(foo_service_jtd.mapping["Method1"].properties.response));

// HTTP POST handler, where the REST route implements a service method.
app.post('/foo/method1', async function(request, response, next) {
  try {
    // local service calls are invoked async, to allow method handlers to make
    // async calls as needed. If no errors are thrown, result looks like:
    // {
    //   data: {},  // Contains response data populated by method handler.
    //   info: {}   // Contains status code and message. See statusUtils.
    // }
    const result = await pocket.serviceUtils.invokeLocalServiceCall(
      request.app, serviceHandler, "Method1", request.body);
    response.json(result);
  } catch (error) {
    console.error(error);
    response.status(500);
    response.send("Error: " + error);
  }
});

module.exports = app;
