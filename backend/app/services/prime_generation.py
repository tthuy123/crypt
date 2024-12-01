import random
from number_theory.modular_arithmetic import mod_pow, jacobi_symbol

def find_k(n):
    """
    Finds k such that n - 1 = 2^k * m, where m is odd
    """
    n1 = n - 1
    k = 0
    while n1 % 2 == 0:
        k += 1
        n1 //= 2
    return k

def miller_rabin_test(n, test_rounds = 50):
    """
    Miller-Rabin primality test.
    
    Args:
        n (int): Number to test for primality
        
    Returns:
        bool: True if probably prime, False if definitely composite
    """
    k = find_k(n)
    m = n // pow(2, k)
    for _ in range(test_rounds):
        a = random.randint(1, n - 1)
        b = mod_pow(a, m, n)

        if b % n == 1:
            return True
        for i in range(k):
            if b % n == n - 1:
                return True
            else:
                b = mod_pow(b, 2, n)
        return False
    return True

def solovay_strassen_test(n, test_rounds = 50):
    """
    Solovay-Strassen primality test.
    
    Args:
        n (int): Number to test for primality
        
    Returns:
        bool: True if probably prime, False if definitely composite
    """
    if (n in [2, 3]):
        return True
    
    for _ in range(test_rounds):
        a = random.randint(1, n - 1)
        x = jacobi_symbol(a, n)

        if x == 0:
            return False
        y = mod_pow(a, (n - 1) // 2, n)

        if x % n == y % n:
            return True
        else:
            return False
    return True

def generate_odd_number(number_of_bits):
    """
    Generate an odd number the specified number of bits.
    
    """
    p = random.getrandbits(number_of_bits)
    p |= (1 << number_of_bits - 1) | 1
    return p

def generate_prime_number(number_of_bits):
    """
    Generate a prime number of specified bit length.
    
    Args:
        bits (int): Desired bit length of the prime number
        k (int): Number of rounds for primality testing
        
    Returns:
        int: Prime number of specified bit length
    """
    while True:
        candidate = generate_odd_number(number_of_bits)
        if miller_rabin_test(candidate):
            return candidate

