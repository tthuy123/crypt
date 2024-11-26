
export function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function extended_euclidean(a, b) {
  if (b === 0) {
    return [a, 1, 0];
  }
  const [d, x1, y1] = extended_euclidean(b, a % b);
  return [d, y1, x1 - Math.floor(a / b) * y1];
}

export function modular_inverse(a, m) {
  const [d, x, y] = extended_euclidean(a, m);
  if (d !== 1) {
    return null;
  }
  return (x % m + m) % m;
}

export function modular_exponentiation(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
        result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
    }

export function isPrime(n) {
  if (n <= 1) return false;  
  if (n <= 3) return true;   
  if (n % 2 === 0 || n % 3 === 0) return false; 

  let i = 5;
  while (i * i <= n) {  // Kiểm tra từ 5 đến √n
    if (n % i === 0 || n % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}