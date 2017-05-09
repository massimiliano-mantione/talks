#include <stdlib.h>
#include <stdio.h>
#define SIZE 2000

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#include <sys/time.h>
#endif

long long startTime;
double getElapsedTime(bool reset)
{
  long long currentTime;

#ifdef WIN32
  if (supported) {
    LARGE_INTEGER counter;
    QueryPerformanceCounter(&counter);
    currentTime = counter.QuadPart;
  }
  else {
    currentTime = timeGetTime();
  }
#elif defined(__EMSCRIPTEN__)
  currentTime = (long long)(emscripten_get_now() * 1000.0);
#else
  struct timeval time;
  gettimeofday(&time, NULL);
  currentTime = time.tv_sec * 1000000LL + time.tv_usec;
#endif
  long long elapsedTime = currentTime - startTime;

  // Correct for possible weirdness with changing internal frequency
  if (elapsedTime < 0) {
    elapsedTime = 0;
  }

  if (reset) {
    startTime = currentTime;
  }

  return elapsedTime / 1000.0;
}


struct Cell {
  int x;
  int y;
  struct Cell* up;
  struct Cell* down;
  struct Cell* left;
  struct Cell* right;
};

Cell grid[SIZE][SIZE];

int abs (int value) {
  return (value >= 0) ? value : -value;
}

int fix (int value) {
  return abs(value) % SIZE;
}

Cell *getCell(int x, int y) {
  return &(grid[fix(x)][fix(y)]);
}

void connect(Cell *cell) {
  cell->up = getCell(cell->x, cell->y - 1);
  cell->down = getCell(cell->x, cell->y + 1);
  cell->left = getCell(cell->x - 1, cell->y);
  cell->right = getCell(cell->x + 1, cell->y);
}

int main () {
  getElapsedTime(true);

  int size = SIZE;

  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      Cell* cell = getCell(i, j);
      cell->x = i;
      cell->y = j;
      cell->up = NULL;
      cell->down = NULL;
      cell->left = NULL;
      cell->right = NULL;
    }
  }

  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      Cell* cell = getCell(i, j);
      connect(cell);
    }
  }

  printf("Elapsed: %f\n", getElapsedTime(false));

  return 0;
}

