exports.parse = function(line) {

  var pairs = line.match(/([a-zA-Z0-9\%\_\-\.\^]+)=?(([a-zA-Z0-9\.\-\_\.\/\@]+)|("([^\"]+)"))?/g)
  var attrs = {}

  if(!pairs) { return attrs }

  pairs.forEach(function(pair) {
    parts = pair.split("=")
    key   = parts.shift()
    value = parts.join("=")
    //strip quotes
    if(value[0] == '"'){
      value = value.substring(1, value.length-1)
    }
    //casts
    if(value == '') value = true;
    else if(value == 'true') value = true;
    else if(value == 'false') value = false;
    else if(/^\d+$/.test(value)) value = parseInt(value);
    attrs[key] = value
  })

  return attrs;
}

exports.stream = process.stdout;

exports.log = function(data, stream) {
  if(stream == undefined) stream = exports.stream;

  var line = '';
  Object.keys(data).forEach(function(key){
    var value = data[key].toString();
    if(value.indexOf(' ') > -1) value = '"' + value + '"';
    line += key + '=' + value + ' ';
  })

  //trim traling space and print w. newline
  stream.write(line.substring(0,line.length-1) + "\n");
}
