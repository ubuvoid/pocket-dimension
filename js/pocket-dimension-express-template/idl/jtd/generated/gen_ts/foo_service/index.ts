// Code generated by jtd-codegen for TypeScript v0.2.1

export type FooService = FooServiceMethod1;

export interface FooServiceMethod1Request {
  another_param: number;
  some_param: string;
}

export interface FooServiceMethod1ResponseDataPoint {
  id: string;
  value: number;
}

export interface FooServiceMethod1Response {
  bigger_unsigned_integer_metadata: string;
  data_points: FooServiceMethod1ResponseDataPoint[];
  fractional_score: number;
  information: string;
  small_integer_metadata: number;
  unsigned_small_int_metadata: number;
}

export interface FooServiceMethod1 {
  method_name: "Method1";
  request: FooServiceMethod1Request;
  response: FooServiceMethod1Response;
}
