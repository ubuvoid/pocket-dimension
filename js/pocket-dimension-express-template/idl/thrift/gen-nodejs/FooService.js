//
// Autogenerated by Thrift Compiler (0.7.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var Thrift = require('thrift').Thrift;

var ttypes = require('./foo_service_types');
//HELPER FUNCTIONS AND STRUCTURES

var pocketdimension.example.foo.FooService_method1_args = function(args) {
  this.request = null;
  if (args) {
    if (args.request !== undefined) {
      this.request = args.request;
    }
  }
};
pocketdimension.example.foo.FooService_method1_args.prototype = {};
pocketdimension.example.foo.FooService_method1_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.request = new ttypes.Method1Request();
        this.request.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

pocketdimension.example.foo.FooService_method1_args.prototype.write = function(output) {
  output.writeStructBegin('FooService_method1_args');
  if (this.request) {
    output.writeFieldBegin('request', Thrift.Type.STRUCT, 1);
    this.request.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var pocketdimension.example.foo.FooService_method1_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
pocketdimension.example.foo.FooService_method1_result.prototype = {};
pocketdimension.example.foo.FooService_method1_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.Method1Response();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

pocketdimension.example.foo.FooService_method1_result.prototype.write = function(output) {
  output.writeStructBegin('FooService_method1_result');
  if (this.success) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var pocketdimension.example.foo.FooServiceClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this.seqid = 0;
    this._reqs = {};
};
pocketdimension.example.foo.FooServiceClient.prototype = {};
pocketdimension.example.foo.FooServiceClient.prototype.method1 = function(request, callback) {
  this.seqid += 1;
  this._reqs[this.seqid] = callback;
  this.send_method1(request);
};

pocketdimension.example.foo.FooServiceClient.prototype.send_method1 = function(request) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('method1', Thrift.MessageType.CALL, this.seqid);
  var args = new pocketdimension.example.foo.FooService_method1_args();
  args.request = request;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

pocketdimension.example.foo.FooServiceClient.prototype.recv_method1 = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new pocketdimension.example.foo.FooService_method1_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('method1 failed: unknown result');
};
var pocketdimension.example.foo.FooServiceProcessor = exports.Processor = function(handler) {
  this._handler = handler
}
pocketdimension.example.foo.FooServiceProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.Exception, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}

pocketdimension.example.foo.FooServiceProcessor.prototype.process_method1 = function(seqid, input, output) {
  var args = new pocketdimension.example.foo.FooService_method1_args();
  args.read(input);
  input.readMessageEnd();
  var result = new pocketdimension.example.foo.FooService_method1_result();
  this._handler.method1(args.request, function (success) {
    result.success = success;
    output.writeMessageBegin("method1", Thrift.MessageType.REPLY, seqid);
    result.write(output);
    output.writeMessageEnd();
    output.flush();
  })
}
