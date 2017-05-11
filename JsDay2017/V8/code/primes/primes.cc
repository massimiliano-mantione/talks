#include <stdio.h>

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

class Primes {
 public:
  int getPrimeCount() const { return prime_count; }
  int getPrime(int i) const { return primes[i]; }
  void addPrime(int i) { primes[prime_count++] = i; }

  bool isDivisibe(int i, int by) { return (i % by) == 0; }

  bool isPrimeDivisible(int candidate) {
    for (int i = 1; i < prime_count; ++i) {
      if (isDivisibe(candidate, primes[i])) return true;
    }
    return false;
  }

 private:
  volatile int prime_count;
  volatile int primes[25000];
};

int main() {
  getElapsedTime(true);
  Primes p;
  int c = 1;
  while (p.getPrimeCount() < 25000) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
    }
    c++;
  }
  printf("%d\n", p.getPrime(p.getPrimeCount()-1));
  printf("Elapsed: %f\n", getElapsedTime(false));
}

