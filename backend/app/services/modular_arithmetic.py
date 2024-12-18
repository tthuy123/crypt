import math

def gcd(a, b):
    """
    Calculates the greatest common divisor of a and b using the Euclidean algorithm.
    Args:
        a: An integer.
        b: An integer.
    Returns:
        The greatest common divisor of a and b.
    """
    while b != 0:
        a, b = b, a % b
    return a

def extended_euclidean(a, b):
    """
    Calculates the coefficients r, s, and t such that as + bt = gcd(a, b) = r.
    Args:
        a: An integer.
        b: An integer.
    Returns:
        A tuple (r, s, t) such that as + bt = r.
    """
    a0 = a
    b0 = b
    t0 = 0
    t = 1
    s0 = 1
    s = 0
    q = a0 // b0
    r = a0 - q * b0

    while r > 0:
        temp = t0 - q * t
        t0 = t
        t = temp
        temp = s0 - q * s
        s0 = s
        s = temp
        a0 = b0
        b0 = r
        q = a0 // b0
        r = a0 - q * b0
    r = b0

    return r, s, t

def multiplicative_inverse(a, b):
    """
    Calculates the multiplicative inverse of b modulo a.
    Args:
        a: An integer.
        b: An integer.
    Returns:
        The multiplicative inverse of b modulo a.
    """
    assert gcd(a, b) == 1, "Inputs must be coprime. "

    a0 = a
    b0 = b
    t0 = 0
    t = 1
    q = a0 // b0
    r = a0 - q * b0

    while r > 0:
        temp = (t0 - q * t) % a
        t0 = t
        t = temp
        a0 = b0
        b0 = r
        q = a0 // b0
        r = a0 - q * b0

    return t

def is_quadratic_residue(a, p):
    """
    Determines if a is a quadratic residue modulo p.
    Args:
        a: An integer.
        p: A prime number.
    Returns:
        True if a is a quadratic residue modulo p, False otherwise.
    """
    assert p % 2 != 0, "p must be an odd prime."
    return mod_pow(a, (p - 1) // 2, p) == 1

def legendre_symbol(a, p):
    return pow(a, (p - 1) // 2, p)

def jacobi_symbol(a, n):
    """
    Calculates the Jacobi symbol (a/n).
    Args:
        a: An integer.
        n: An odd positive integer.
    Returns:
        1 if a is a quadratic residue modulo n, -1 if a is a non-residue modulo n, and 0 if a is divisible by n.
    """
    assert (n > 0 and n % 2 != 0), "n must be an odd positive integer."
        
    a = a % n
    result = 1

    while a != 0:
        while a % 2 == 0:
            a //= 2
            if n % 8 in [3, 5]:
                result = -result
        
        a, n = n, a  
        if a % 4 == 3 and n % 4 == 3:
            result = -result
        
        a = a % n
    
    if n == 1:
        return result
    else:
        return 0

def prime_factors(n):
    """
    Returns the prime factors of n.
    Args:
        n: An integer.
    Returns:
        A list of prime factors of n
    """
    factors = []
    while n % 2 == 0:
        factors.append(2)
        n //= 2
    
    for i in range(3, math.isqrt(n) + 1, 2):
        while n % i == 0:
            factors.append(i)
            n //= i
    
    if n > 2:
        factors.append(n)
    
    return factors

def is_primitive_element(alpha, p):
    """
    Determines if alpha is a primitive element modulo p.
    Args:
        alpha: An integer.
        p: A prime number.
    Returns:
        True if alpha is a primitive element modulo p, False otherwise.
    """
    
    p1 = p - 1
    prime_factors_p1 = prime_factors(p1)
    for factor in prime_factors_p1:
        if mod_pow(alpha, p1 // factor, p) == 1:
            return False
    return True

def smallest_primitive_element(p):
    """
    Returns the smallest primitive element modulo p.
    """
    for i in range(2, p):
        if is_primitive_element(i, p):
            return i
    raise ValueError("No primitive element found")    

def mod_sqrt(a, p):
    """Find modular square root if it exists"""
    if legendre_symbol(a, p) != 1:
        return None
    elif a == 0:
        return 0
    elif p % 4 == 3:
        return mod_pow(a, (p + 1) // 4, p)
    
    # For p % 4 == 1, implement Tonelli-Shanks algorithm
    q = p - 1
    s = 0
    while q % 2 == 0:
        q //= 2
        s += 1
    
    z = 2
    while legendre_symbol(z, p) != -1:
        z += 1
    
    m = s
    c = mod_pow(z, q, p)
    t = mod_pow(a, q, p)
    r = mod_pow(a, (q + 1) // 2, p)
    
    while t != 1:
        i = 0
        temp = t
        while temp != 1:
            temp = (temp * temp) % p
            i += 1
            if i == m:
                return None
        
        b = mod_pow(c, mod_pow(2, m - i - 1), p)
        m = i
        c = (b * b) % p
        t = (t * c) % p
        r = (r * b) % p
    
    return r

def mod_pow(base, exponent, modulus):
    """
    Calculates the residue of base^exponent modulo modulus.
    Args:
        base: An integer.
        exponent: An integer.
        modulus: An integer.
    Returns:
        The residue of base^exponent modulo modulus.
    """
    z = 1
    expBin = bin(exponent)[2:]
    for i in expBin:
        if (i == "1"):
            z = base * z * z % modulus
        else:
            z = z * z % modulus
    return z


