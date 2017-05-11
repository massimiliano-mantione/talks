
var size = 2000;
var i, j;

var grid = new Array(size);
grid.size = size;
for (i = 0; i < size; i++) {
  grid[i] = new Array(size);
}

grid.fix = function(value) {
  return Math.abs(value) % this.size;
}

grid.getCell = function(x, y) {
  return this[this.fix(x)][this.fix(y)];
}
grid.setCell = function(x, y, value) {
  this[this.fix(x)][this.fix(y)] = value;
}

var start = Date.now();

for (i = 0; i < size; i++) {
  for (j = 0; j < size; j++) {
    grid.setCell(i, j, {
      x: i,
      y: j,
      up: null,
      down: null,
      left: null,
      right: null,
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

var end = Date.now();
console.log("Elapsed: " + (end - start));

