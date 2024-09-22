// Built upon template generated with express-generator.
// Status: draft.

const Ajv = require('ajv/dist/jtd');
const ajv = new Ajv();

const express = require('express');
const pocket = require('pocket-dimension-framework');

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

// Endpoint for an example REST service.
const serviceHandler = pocket.serviceUtils.buildServiceHandler("FooService");

// JTD schema definition. See included file for an example.
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
//          "response": { "properties": { ... } }}
//        }
//    }
// }
const foo_service_jtd = require('../idl/jtd/foo_service.jtd.cjs');

// Populate response_data, return okStatus().
const method1Handler = function (app, request_data, response_data) {
  const randomInt = function (span, offset = 0) {
    return Math.floor((Math.random() * span) + offset)
  }
  // For this example method, we ignore the input and generate random data
  response_data.information = "amazing_fact_" + randomInt(9999)
  response_data.fractional_score = Math.random()
  response_data.small_integer_metadata = randomInt(Math.pow(2,32), -(Math.pow(2,31)))
  response_data.unsigned_small_int_metadata = randomInt(Math.pow(2,32))
  response_data.bigger_unsigned_integer_metadata = randomInt(Math.pow(2,48)).toString()
  const num_points = randomInt(10)
  response_data.data_points = []
  for (let i = 0; i < num_points; i++) {
    response_data.data_points.push(
        {id: "factoid_" + randomInt(9999), value: Math.random() })
  }

  return pocket.statusUtils.okStatus();
}

serviceHandler.registerCallback(
  "Method1",
  method1Handler,
  ajv.compile(foo_service_jtd.mapping["Method1"].properties.request),
  ajv.compile(foo_service_jtd.mapping["Method1"].properties.response));

// Post handler (request obj as json body)
app.post('/foo/method1', async function(req, res, next) {
  try {
    // local service calls are invoked async, to allow method handlers to make
    // async calls as needed.
    const result = await pocket.serviceUtils.invokeLocalServiceCall(
      req.app, serviceHandler, "Method1", req.body);
    // If no error was thrown, result looks like:
    //  {
    //    data: {},  // contains response data populated by method handler
    //    info: {}   // contains status code and message, see statusUtils
    //  }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Error: " + error);
  }
});

module.exports = app;
