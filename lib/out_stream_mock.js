exports = module.exports = function OutStreamMock(){
  this.lines = [];
  this.logline = '';
  this.write = function(string) {
    this.logline = string;
    this.lines.push(string);
  }
}
