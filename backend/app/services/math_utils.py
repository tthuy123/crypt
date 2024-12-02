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
    

# from https://stackoverflow.com/questions/44531084/python-check-if-a-number-is-a-square
def is_square(n):
    if n < 0:
        return False
    if n == 0:
        return True
    x, y = 1, n
    while x + 1 < y:
        mid = (x+y)//2
        if mid**2 < n:
            x = mid
        else:
            y = mid
    return n == x**2 or n == (x+1)**2
#-------------------------------------------------------------------------------

# adapted from https://rosettacode.org/wiki/Jacobi_symbol#Python
def jacobi(a, n):
  a %= n
  result = 1
  while a != 0:
      while a % 2 == 0:
          a //= 2
          n_mod_8 = n % 8
          if n_mod_8 in (3, 5):
              result = -result
      a, n = n, a
      if a % 4 == 3 and n % 4 == 3:
          result = -result
      a %= n
  if n == 1:
      return result
  else:
      return 0
#-------------------------------------------------------------------------------
def miller_rabin(n):
  """
  This implemetation uses a single base, 2, but is written in a way
  that allows additional bases to be added easily if required

  The last line, commented out, is an example of how the the routine could be modified
  if more bases are required
  """
  
  # find s,d so that d is odd and (2^s)d = n-1
  d = (n-1)>>1
  s = 1
  while d&1 == 0:
    d >>= 1
    s += 1

  def sprp(a):
    # test whether 'n' is a strong probable prime to base 'a'
    a = pow(a,d,n)
    if a == 1 :
      return True
    for r in range(s-1):
      if a==n-1:
        return True
      a = (a*a)%n
    return a == n-1

  return sprp(2)
  #return all( sprp(a) for a in (2,3,5) )
#-------------------------------------------------------------------------------

def D_chooser(n):
  #Choose a D value suitable for the Baillie-PSW test
  D = 5
  j = jacobi(D, n)

  while j > 0:
    D += 2 if D > 0 else -2
    D *= -1

    if D==-15 :
      # check for a square
      if is_square(n):
        # The value of D isn't 0, but we are just communicating
        # that we have found a square
        return (0,0) 

    j = jacobi(D, n)
  return (D,j)
#-------------------------------------------------------------------------------
"""
def div2mod(x,n):
  # divide by 2 modulo n
  # assumes n is odd
  if x & 1:
    return ((x+n)>>1)%n
  return (x>>1)%n
"""
div2mod = lambda x,n: ((x+n)>>1)%n if x&1 else (x>>1)%n
#-------------------------------------------------------------------------------

def U_V_subscript(k, n, P, D):
  U=1
  V=P
  digits = bin(k)[2:]

  for digit in digits[1:]:
    U, V = (U*V) % n,  div2mod(V*V + D*U*U, n)

    if digit == '1':
      U,V = div2mod(P*U + V, n), div2mod(D*U + P*V, n)
  return U, V
#-------------------------------------------------------------------------------

def lucas_pp(n, D, P, Q):                                                                                                                                                                                                                         
  assert n & 1
  U, V = U_V_subscript(n+1, n, P, D)
  return U==0
#-------------------------------------------------------------------------------

def lucas_spp(n, D, P, Q):
  # Lucas strong probable prime test
  # https://arxiv.org/pdf/2006.14425v1.pdf
  # This is a bit slower than lucas_pp, so is not used

  assert n & 1
  
  d = n+1
  s = 0
  while (d & 1) == 0 :
    s+=1
    d >>= 1

  
  U, V = U_V_subscript(d, n, P, D)
  if U==0:
      return True

  Q = pow(Q,d,n)

  for r in range(s):
    if V==0:
        return True  
    V = ( V*V - 2*Q)%n
    Q = pow(Q,2,n)
  
  return False

#-------------------------------------------------------------------------------
def is_prime(n):

  if n <= 1: return False
  if n&1==0:
    return n==2

  # need to test small primes as the D chooser might not find
  # a suitable value for small primes
  for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
            53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101]:
    if n % p == 0:
      return n==p

  if not miller_rabin(n):
    #print("miller rabin identifies composite")  
    return False

  
  D,j = D_chooser(n)
  if j==0:
    return False # see [1]

  # even numbers and squares have been eliminated by this point
  return lucas_pp(n, D, 1, (1-D)//4) # slightly faster than lucas_spp


# def is_prime(n):
#     if n <= 1:
#         return False
#     if n <= 3:
#         return True
#     if n % 2 == 0 or n % 3 == 0:
#         return False
#     i = 5
#     while i * i <= n:
#         if n % i == 0 or n % (i + 2) == 0:
#             return False
#         i += 6
#     return True
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