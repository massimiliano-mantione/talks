#!/bin/bash
alias emcc=/SSD/massi/talks/Codemotion2017/code/emsdk-portable/emscripten/1.37.22/emcc
vim grid-1-arraysize.js
pause
echo node grid-1-arraysize.js
node grid-1-arraysize.js
pause
echo node grid-2-constructor.js
node grid-2-constructor.js
pause
diff -u grid-1-arraysize.js grid-2-constructor.js | less
pause
echo node grid-5-fast.js
node grid-5-fast.js
pause
diff -u grid-2-constructor.js grid-5-fast.js | less
pause
echo g++ -O3 grid.cc -o grid
g++ -O3 grid.cc -o grid
pause
./grid
pause
echo emcc -O3 grid.cc -s TOTAL_MEMORY=128MB -o grid.js
emcc -O3 grid.cc -s TOTAL_MEMORY=128MB -o grid.js
pause
node grid.js
pause
