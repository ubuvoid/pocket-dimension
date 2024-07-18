// Built upon template generated with express-generator.
// Status: draft.

var express = require('express');
var app = express();

var pocket = require('pocket-dimension-framework');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* GET home page. */
router.get('/', function(req, res, next) {
  // TODO: Update this template with something specific, like directions for
  // how to query an example rest endpoint.
  res.render('index', { title: 'Pocket Dimension Example' });
});


// Endpoint for an example REST service.
// TODO Write IDL (JTD, proto, etc.) and supply validator fn's generated from IDL.
const handler = pocket.serviceUtils.buildServiceHandler("FooService");

const method1Handler = function (app, request_data, response_data) {
  // TODO Write an actual handler, populate response_data, and return okStatus()
  return pocket.statusUtils.notImplementedStatus();
}

// TODO: Write validator functions from object schemas and pass them in here.
handler.registerCallback("Method1", method1Handler);

app.post('/foo/method1', async function(req, res, next) {
  try {
    let result = await pocket.serviceUtils.invokeLocalServiceCall(
      req.app, handler, "Method1", req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Error: " + error);
  }
});

module.exports = app;
