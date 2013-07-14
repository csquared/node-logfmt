#include <node.h>
#include <v8.h>
#include <string>

using namespace v8;
using namespace std;

Handle<Value> logfmt_parse( const Arguments& args ) {
  HandleScope scope;
  Local<Object> result = Object::New();

  String::Utf8Value _line(args[0]->ToString());
  string line(*_line);

  bool in_key = true;
  bool in_value = false;
  bool in_quote = false;
  bool is_number = true;
  string current_key;
  string current_value;

  for(int i = 0; i < line.length(); i++){
    if(line[i] == '=') {
      in_key = false;
      in_value = true;
    }else if(line[i] == '"' && !in_quote){
      in_quote = true;
    }else if(line[i] == '"' && in_quote){
      in_quote = false;
    }else if(line[i] == ' ' && !in_quote){

      if(current_value.length() == 0){
        result->Set( String::New( current_key.c_str() ), Boolean::New(true) );
      }else if(is_number){
        result->Set( String::New( current_key.c_str() ), Number::New(atoi(current_value.c_str())) );
      }else{
        result->Set( String::New( current_key.c_str() ), String::New(current_value.c_str()) );
      }

      current_key = "";
      current_value = "";
      in_key = true;
      in_value = false;
      is_number = true;
    }else if(in_key){
      current_key.push_back(line[i]);
    }else if(in_value){
      if(line[i] > 65) is_number = false;
      current_value.push_back(line[i]);
    }
  }

  //get the tail
  if(current_key.length() > 0 || in_value){
    if(current_value.length() == 0){
      result->Set( String::New( current_key.c_str() ), Boolean::New(true) );
    }else{
      result->Set( String::New( current_key.c_str() ), String::New(current_value.c_str()) );
    }
  }

  return scope.Close( result );
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("parse"),
              FunctionTemplate::New(logfmt_parse)->GetFunction());
}

NODE_MODULE(logfmt_extension, init)
