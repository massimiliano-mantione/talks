#!/bin/bash
echo quick recap
echo js / c++
echo 6000 / 1530 == 3.92
pause
echo problematic profile data
pause
echo node --prof-process isolate-0x27a2650-v8.log
node --prof-process isolate-0x321e250-v8.log | less
pause
echo a simple code patch
pause
diff primes-0.js primes-1-fixed.js
pause
vim primes-1-fixed.js
pause
echo node primes-1-fixed.js
node primes-1-fixed.js
node primes-1-fixed.js
node primes-1-fixed.js
echo about 1450
pause
echo proper profile data
pause
node --prof-process isolate-0x2c1d260-v8.log | less
pause
echo ./primes
g++ primes.cc -o primes
./primes
./primes
./primes
echo about 1530
pause
echo js / c++
echo 1450 / 1530 == 0.95
pause
echo WAT?
pause
echo c++ was not optimized...
pause
echo g++ -O3 primes.cc -o primes
g++ -O3 primes.cc -o primes
pause
echo ./primes
./primes
pause
echo 1450 / 1000 = 1.45
pause
echo emscripten to the rescue
echo emcc primes.cc -o primes.js
/SSD/massi/talks/Codemotion2017/code/emsdk-portable/emscripten/1.37.22/emcc primes.cc -o primes.js
echo emcc done
pause
echo node primes.js
node primes.js
pause
echo wait...
pause
echo c++ was not optimized!
pause
echo emcc -O3 primes.cc -o primes.js
/SSD/massi/talks/Codemotion2017/code/emsdk-portable/emscripten/1.37.22/emcc -O3 primes.cc -o primes.js
echo emcc done
pause
echo node primes.js
node primes.js
node primes.js
node primes.js
echo about 1180
pause
echo js / c++
echo 1180 / 1000 == 1.18
echo Woo-Hoo!!!
pause
echo typed arrays
echo node primes-2-typed.js
node primes-2-typed.js
node primes-2-typed.js
node primes-2-typed.js
echo about 1330
echo improvement: 1450 / 1330 == 1.09
pause
echo fix the algorithm
pause
diff primes-1-fixed.js primes-3-sqrt.js
pause
echo node primes-3-sqrt.js
node primes-3-sqrt.js
node primes-3-sqrt.js
node primes-3-sqrt.js
echo about 175
echo improvement: 5900 / 175 == 33.71
pause
echo 30 times faster!
pause
