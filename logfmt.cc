#include <node.h>
#include <v8.h>
#include <string>

using namespace v8;
using namespace std;

Handle<Value> logfmt_parse( const Arguments& args ) {
  HandleScope scope;
  Local<String> line = args[0]->ToString();
  Local<Object> result = Object::New();
  result->Set( String::New( "line" ), line );
  return scope.Close( result );
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("parse"),
              FunctionTemplate::New(logfmt_parse)->GetFunction());
}

NODE_MODULE(logfmt_extension, init)
