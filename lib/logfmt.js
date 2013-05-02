exports.parse = function(line) {

  var pairs = line.match(/([a-zA-Z0-9\_\-\.]+)=?(([a-zA-Z0-9\.\-\_\.]+)|("([^\"]+)"))?/g)
  var attrs = {}

  if(!pairs) { return attrs }

  pairs.forEach(function(pair) {
    parts = pair.split("=")
    key   = parts.shift()
    value = parts.join("=")
    if(value[0] == '"'){
      value = value.substring(1, value.length-1)
    }
    attrs[key] = value
  })

  return attrs;
}
