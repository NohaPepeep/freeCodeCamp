---
title: Smallest multiple
localeTitle: Наименьшее количество
---
## Проблема 5: Наименьшая множественность

### Метод:

*   В этой задаче нам нужно найти LCM от 1 до n чисел.
*   Чтобы найти LCM числа, мы используем следующую формулу:
*   ![LCM](https://wikimedia.org/api/rest_v1/media/math/render/svg/9453a93953efe119b7502c1827aeeb869ab121d6)
*   Чтобы найти GCD (Greatest Common Divisor) из двух чисел, мы используем алгоритм Евклида.
*   Как только мы получим LCM двух чисел, мы можем получить LCM чисел от 1 до n.

### Решение:

```js
//LCM of two numbers 
 function lcm(a, b){ 
  return (a*b)/gcd(a, b); 
 } 
 
 //Euclidean recursive algorithm 
 function gcd(a, b){ 
  if (b === 0) return a; 
  return gcd(b, a%b); 
 } 
 
 function smallestMult(n){ 
  let maxLCM = 1; 
 
  //Getting the LCM in the range 
  for (let i = 2; i <= n; i++){ 
    maxLCM = lcm(maxLCM, i); 
  } 
  return maxLCM; 
 } 
```


### Рекомендации:

*   [Евклидовой алгоритм](https://en.wikipedia.org/wiki/Euclidean_algorithm)
*   [LCM](https://en.wikipedia.org/wiki/Least_common_multiple)