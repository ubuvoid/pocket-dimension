namespace js pocketdimension.example.foo
namespace py pocketdimension.example.foo
namespace cpp pocketdimension.example.foo
namespace java pocketdimension.example.foo
namespace go pocketdimension.example.foo

struct Method1Request {
  1: optional string some_param;
  2: optional double another_param;
}

// Thrift doesn't nested struct definitions, so we approximate:
struct Method1Response_InnerData {
	1: optional string id;
	2: optional double value;
}

struct Method1Response {
  1: optional string information;

  // Number fields of various types, to show json representation.
  2: optional double fractional_score;
  3: optional i32 small_integer_metadata;

  // Thrift has no unsigned number types, so again we approximate:
  4: optional i32 unsigned_small_int_metadata;
  5: optional i64 bigger_unsigned_integer_metadata;

  // Included structs:
  6: list<Method1Response_InnerData> data_points;
}

service FooService {
  Method1Response method1(1:Method1Request request)
}
