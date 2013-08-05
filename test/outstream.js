exports = module.exports = function OutStream(){
  this.logline = '';
  this.write = function(string) {
    this.logline = string;
  }
}
