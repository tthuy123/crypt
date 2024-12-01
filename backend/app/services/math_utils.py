import random 
import math

# Function to calculate (base^exponent)%modulus 
def modular_pow(base, exponent,modulus):

    # initialize result 
    result = 1

    while (exponent > 0):
    
        # if y is odd, multiply base with result 
        if (exponent & 1):
            result = (result * base) % modulus

        # exponent = exponent/2 
        exponent = exponent >> 1

        # base = base * base 
        base = (base * base) % modulus
    
    return result

def extended_euclid(a, b):
    if b == 0:
        return a, 1, 0
    else:
        d, x, y = extended_euclid(b, a % b)
        return d, y, x - (a // b) * y
def modular_inverse(a,b): #b^-1 mod a
    d,y,x= extended_euclid(a,b)
    if d != 1:
        return None
    else:
        return x % a
    
def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
# method to return prime divisor for n 
def PollardRho( n):

    # no prime divisor for 1 
    if (n == 1):
        return n

    # even number means one of the divisors is 2 
    if (n % 2 == 0):
        return 2
    
    if is_prime(n):
        return n

    # we will pick from the range [2, N) 
    x = (random.randint(0, 2) % (n - 2))
    y = x

    # the constant in f(x).
    # Algorithm can be re-run with a different c
    # if it throws failure for a composite. 
    c = (random.randint(0, 1) % (n - 1))

    # Initialize candidate divisor (or result) 
    d = 1

    # until the prime factor isn't obtained.
    # If n is prime, return n 
    while (d == 1):
    
        # Tortoise Move: x(i+1) = f(x(i)) 
        x = (modular_pow(x, 2, n) + c + n)%n

        # Hare Move: y(i+1) = f(f(y(i))) 
        y = (modular_pow(y, 2, n) + c + n)%n
        y = (modular_pow(y, 2, n) + c + n)%n

        # check gcd of |x-y| and n 
        d = math.gcd(abs(x - y), n)

        # retry if the algorithm fails to find prime factor
        # with chosen x and c 
        if (d == n):
            return PollardRho(n)
    
    return d
def prime_factors(n):
    factors = set()  
    while n != 1:
        factor = PollardRho(n)
        factors.add(factor)
        n //= factor

    return factors

def is_primitive_element(g, p, factors):
    phi = p - 1
    for factor in factors:
        if pow(g, phi // factor, p) == 1:
            return False
    return True

def find_primitive_element(p):
    factors = prime_factors(p - 1)
    for g in range(2, min(p, 100)):  
        if is_primitive_element(g, p, factors):
            return g
            
        
    return None