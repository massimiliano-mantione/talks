#!/bin/bash
echo g++ primes.cc -o primes
g++ primes.cc -o primes
pause
echo ./primes
./primes
pause
echo node primes-0.js
node primes-0.js
pause
echo 6557 / 1440
bc -l <<< "scale=2; 6557 / 1440.394000"
pause
