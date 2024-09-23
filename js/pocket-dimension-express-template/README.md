Pocket Dimension Express Template

Example REST server built with a minimum of dependencies, with request and response validation. Generated from basic Express template for demonstration purposes:

```
$ npx express-generator --ejs --git
```

See routes/index.js for handler setup.
See idl/jtd/foo_service.jtd.cjs for request and response payload schemas.

```
# Start server
$ npm start

> pocket-dimension-express-template@0.0.1 start
> node ./bin/www
```

```
# Invoke FooService.Method1 via REST. Handler returns { "data": {}, "info": {} }, where 'data' matches the Response JTD schema and 'info' contains call status.
$ curl localhost:3000/foo/method1 -H "Content-Type: application/json" -d '{"some_param":"foo","another_param":256}' | jq
{
  "data": {
    "information": "amazing_foo_fact_592",
    "fractional_score": 37.06920726453143,
    "small_integer_metadata": -1965580223,
    "unsigned_small_int_metadata": 3251496412,
    "bigger_unsigned_integer_metadata": "5562177432151",
    "data_points": [
      {
        "id": "factoid_6035",
        "value": 0.5776218528271515
      },
      {
        "id": "factoid_3249",
        "value": 0.1943714549634139
      }
    ]
  },
  "info": {
    "status": {
      "code": 200
    }
  }
}
```

```
# Verify request validation. HTTP call returns 200, response body's 'info' property contains status information:
$ curl localhost:3000/foo/method1 -H "Content-Type: application/json" -d '{"some_param":"foo","another_param":"fails validation, should be float64"}' | jq
{
  "info": {
    "status": {
      "code": 400,
      "message": "BAD_REQUEST"
    }
  }
}

# server logs:
Request validation failure:  [
  {
    instancePath: '/another_param',
    schemaPath: '/properties/another_param/type',
    keyword: 'type',
    params: { type: 'float64', nullable: false },
    message: 'must be float64'
  }
]
POST /foo/method1 200 8.874 ms - 56
```
