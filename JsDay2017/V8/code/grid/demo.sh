#!/bin/bash
vim grid-1-arraysize.js
pause
echo node grid-1-arraysize.js
node grid-1-arraysize.js
pause
echo node grid-2-constructor.js
node grid-2-constructor.js
pause
diff -u grid-1-arraysize.js grid-2-constructor.js
pause
echo node grid-5-fast.js
node grid-5-fast.js
pause
diff -u grid-1-arraysize.js grid-5-fast.js
pause
