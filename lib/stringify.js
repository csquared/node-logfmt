exports.stringify = function stringify(data, prefix){
  var line = '';

  for(var key in data) {
    var value = data[key];
    var is_null = false;
    if(value == null) {
      is_null = true;
      value = '';
    }
    else if(typeof value === "object") {
      var elem = stringify(value, key) + ' ';
      line += elem;
      continue;
    }
    else value = value.toString();

    var needs_quoting  = value.indexOf(' ') > -1 || value.indexOf('=') > -1;
    var needs_escaping = value.indexOf('"') > -1 || value.indexOf("\\") > -1;

    if(needs_escaping) value = value.replace(/["\\]/g, '\\$&');
    if(needs_quoting) value = '"' + value + '"';
    if(value === '' && !is_null) value = '""';

    var elem = (prefix ? `${prefix}.${key}` : key) + '=' + value + ' ';
    line += elem;
  }

  //trim traling space
  return line.substring(0,line.length-1);
}

