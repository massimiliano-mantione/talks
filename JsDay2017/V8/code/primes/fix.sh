#!/bin/bash
echo problematic profile data
pause
echo node --prof-process isolate-0x27a2650-v8.log
node --prof-process isolate-0x27a2650-v8.log | less
pause
echo code patch
pause
diff primes-0.js primes-1-no-out-of-bounds.js
pause
vim primes-1-no-out-of-bounds.js
pause
echo node primes-1-no-out-of-bounds.js
node primes-1-no-out-of-bounds.js
pause
echo proper profile data
pause
node --prof-process isolate-0x31a7670-v8.log | less
pause
echo ./primes
g++ primes.cc -o primes
./primes
pause
echo node primes-1-no-out-of-bounds.js
node primes-1-no-out-of-bounds.js
pause
echo 1365 / 1440
bc -l <<< "scale=2; 1365 / 1440.394000"
pause
echo g++ -O3 primes.cc -o primes
g++ -O3 primes.cc -o primes
pause
echo ./primes
./primes
pause
echo 1365 / 854
bc -l <<< "scale=2; 1365 / 854"
pause
echo emscripten to the rescue
echo emcc primes.cc -o primes.js
emcc primes.cc -o primes.js
echo emcc done
pause
echo node primes.js
node primes.js
pause
echo emcc -O3 primes.cc -o primes.js
emcc -O3 primes.cc -o primes.js
echo emcc done
pause
echo node primes.js
node primes.js
pause
echo ./primes
./primes
pause
echo 1099 / 854
bc -l <<< "scale=2; 1099 / 854"
pause
