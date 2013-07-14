#include <node.h>
#include <v8.h>

using namespace v8;

Handle<Value> logfmt_parse( const Arguments& args ) {
  HandleScope scope;
  return scope.Close( Undefined() );
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("parse"),
              FunctionTemplate::New(logfmt_parse)->GetFunction());
}

NODE_MODULE(logfmt_extension, init)
