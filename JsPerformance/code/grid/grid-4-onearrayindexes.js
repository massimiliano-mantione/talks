
var size = 2000;
var i, j;

var grid = new Array();
grid.size = size;

grid.fix = function(value) {
  return Math.abs(value) % this.size;
}

grid.cellIndex = function(x, y) {
  return this.size * this.fix(x) + this.fix(y);
}

grid.getCell = function(x, y) {
  return this[this.cellIndex(x, y)];
}
grid.setCell = function(x, y, value) {
  this[this.cellIndex(x, y)] = value;
}

for (i = 0; i < size; i++) {
  for (j = 0; j < size; j++) {
    grid.setCell(i, j, {
      x: i,
      y: j,
      connect: function(g) {
        this.up     = g.getCell(this.x, this.y - 1);
        this.down   = g.getCell(this.x, this.y - 1);
        this.left   = g.getCell(this.x - 1, this.y);
        this.right  = g.getCell(this.x + 1, this.y);
      }
    });
  }
}

for (i = 0; i < size; i++) {
  for (j = 0; j < size; j++) {
    grid.getCell(i, j).connect(grid);
  }
}

