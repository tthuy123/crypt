import random
import hashlib
from app.services.modular_arithmetic import is_quadratic_residue, mod_pow, multiplicative_inverse, legendre_symbol
def elliptic_func(x, a, b, p):
    return (mod_pow(x, 3, p) + a * x + b) % p

def cipolla(n, p):
    """
    Find square roots of n modulo p using Cipolla's algorithm
    Args:
        n: Integer to find square roots of
        p: Prime number
    Returns:
        A tuple of square roots of n modulo p
    """
    if n == 0:
        return 0, 0
    
    if not is_quadratic_residue(n, p):
        return None, None
        
    a = 0
    while True:
        a = random.randrange(p)
        w = (a * a - n) % p
        if not is_quadratic_residue(w, p):
            break
            
    def multiply(x1, y1, x2, y2, w):
        return ((x1 * x2 + y1 * y2 * w) % p,
                (x1 * y2 + y1 * x2) % p)
    
    def power(x, y, n, w):
        result = (1, 0)
        power = (x, y)
        while n:
            if n & 1:
                result = multiply(result[0], result[1], power[0], power[1], w)
            power = multiply(power[0], power[1], power[0], power[1], w)
            n >>= 1
        return result
    
    r = power(a, 1, (p + 1) // 2, w)[0]
    if (r * r) % p == n:
        return r, p - r
    return None, None

def point_add(P, Q, curve):
        """
        Add two points P and Q on the elliptic curve.
        Args:
            P, Q: Points to add
            curve: Curve parameters (a, b, p)
        Returns:
            The sum of P and Q
        """
        a, b, p = curve
        if P is None:
            return Q
        if Q is None:
            return P

        x1, y1 = P
        x2, y2 = Q

        if x1 == x2 and (y1 != y2 or y1 == 0):
            return None

        if P != Q:
            numerator = (y2 - y1) % p
            denominator = (x2 - x1) % p
        else:
            numerator = (3 * x1 ** 2 + a) % p
            denominator = (2 * y1) % p

        inv_denominator = multiplicative_inverse(p, denominator)
        if inv_denominator is None:
            return None

        lam = (numerator * inv_denominator) % p
        x3 = (lam ** 2 - x1 - x2) % p
        y3 = (lam * (x1 - x3) - y1) % p

        return (x3, y3)

def scalar_multiply(k, P, curve):
    """
    Multiply a point by a scalar using double-and-add method.
    Args:
        k: Scalar to multiply by 
        P: Point to multiply
        curve: Curve parameters (a, b, p)
    Returns:
        The result of the scalar multiplication
    """
    if k == 0 or P is None:
        return None
    
    p = curve[2]
    k = k % p  # Reduce k modulo p
    result = None
    addend = P
    
    while k:
        if k & 1:
            result = point_add(result, addend, curve)
        addend = point_add(addend, addend, curve)
        k >>= 1
    
    return result

def point_neg(P, curve):
    """
    Return the negative of a point

    Args:
        P: Point to negate
        curve: Curve parameters (a, b, p)
    Returns:
        The negative of the point
    """
    p = curve[2]
    if P is None:
        return None
    x, y = P
    return x, (-y) % p

def is_on_curve(point, curve):
    """
    Check if a point lies on the curve
    
    Args:
        point: Point to check
        curve: Curve parameters (a, b, p)
    Returns:
        A boolean indicating if the point lies on the curve
    """
    if point is None:
        return True
    a, b, p = curve
    x, y = point
    return (y ** 2) % p == elliptic_func(x, a, b, p)

def ecc_generate_keypair(P, s, curve):
    """
    Generate private and public key pair

    Args:
        P: Generator point
        s: A randomly generated integer
        curve: Curve parameters (a, b, p)

    Returns:
        tuple: Private and public key pairs ((s, P, curve), (P, B, curve))
    """
    B = scalar_multiply(s, P, curve)
    
    return (s, P, curve), (P, B, curve)

def ecc_encrypt(M, k, public_key):
    """
    ECC encryption

    Args:
        M: Message point
        k: Random integer
        public_key: Public key (P, B, curve)

    Returns:
        tuple: Ciphertext points (M1, M2)
    """
    P, B, curve = public_key
    
    if not is_on_curve(M, curve):
        raise ValueError("Message point must lie on the curve")
    
    if not (is_on_curve(P, curve) and is_on_curve(B, curve)):
        raise ValueError(f"Public points must lie on the curve.\nP on curve? {is_on_curve(P, curve)}\nB on curve? {is_on_curve(B, curve)}")
        
    M1 = scalar_multiply(k, P, curve)
    kB = scalar_multiply(k, B, curve)
    M2 = point_add(M, kB, curve)
    
    return M1, M2

def ecc_decrypt(ciphertext, private_key):
    """
    ECC decryption

    Args:
        ciphertext: Ciphertext points (M1, M2)
        private_key: Private key (s, P, curve)

    Returns:
        tuple: Message point M
    """
    M1, M2 = ciphertext
    s, _, curve = private_key
    
    if not is_on_curve(M1, curve) or not is_on_curve(M2, curve):
        raise ValueError("Ciphertext points must lie on the curve")
    
    # M = M2 -sM1
    neg_sM1 = point_neg(scalar_multiply(s, M1, curve), curve)
    M = point_add(M2, neg_sM1, curve)
    return M

def hash_message(message):
    """Hash a message to a point on the curve"""
    return int.from_bytes(hashlib.sha512(message.encode()).digest(), "big")

def ecdsa_generate_keypair(P, n, d, curve):
    """
    Generate an ECDSA keypair
    Args:
        P: Generator point
        n: Generator order
        d: A randomly integer in the range [1, n-1]
        curve: Curve parameters (a, b, p)
    Returns:
        A tuple of private and public key pairs
    """
    Q = scalar_multiply(d, P, curve)
    return (P, n, d, curve), (P, Q, n, curve)

def is_valid_k(k, message, private_key, curve):
    P, n, d, _ = private_key
    kG = scalar_multiply(k, P, curve)

    x1, _ = kG

    r = x1 % n
    if r == 0:
        return False

    h = hash_message(message)
    s = (multiplicative_inverse(n, k) * (h + r * d)) % n

    if s == 0:
        return False
    
    return True
    
def ecdsa_sign(message, k, private_key, curve):
    P, n, d, _ = private_key
    kG = scalar_multiply(k, P, curve)

    x1, _ = kG

    r = x1 % n
    h = hash_message(message)
    s = (multiplicative_inverse(n, k) * (h + r * d)) % n

    return r, s

# def ecdsa_sign(message, private_key, curve):
#     """
#     Sign a message using ECDSA
#     Args:
#         message: Message to sign
#         private_key: A tuple of private key parameters
#         curve: Curve parameters (a, b, p)
#     Returns:
#         A tuple of signature (r, s)
#     """
#     P, n, d, _ = private_key
#     h = hash_message(message)
#     k = random.randint(1, n - 1)

#     kP = scalar_multiply(k, P, curve)
#     while kP[0] % n == 0:
#         k = random.randint(1, n - 1)
#         kP = scalar_multiply(k, P, curve)
#     r = kP[0] % n
#     s = (multiplicative_inverse(n, k) * (h + r * d)) % n
#     while s % n == 0:
#         k = random.randint(1, n - 1)
#         kP = scalar_multiply(k, P, curve)
#         while kP[0] % n == 0:
#             k = random.randint(1, n - 1)
#             kP = scalar_multiply(k, P, curve)
#         r = kP[0] % n
#         s = (multiplicative_inverse(n, k) * (h + r * d)) % n
#     return r, s
    
def ecdsa_verify(message, signature, public_key):
    """
    Verify an ECDSA signature
    Args:
        message: Message to verify
        signature: Signature to verify
        public_key: A tuple of public key parameters
    Returns:
        A boolean indicating if the signature is valid
    """
    P, Q, n, curve = public_key
    r, s = signature
    if not (0 < r < n and 0 < s < n):
        return False
    h = hash_message(message)
    w = multiplicative_inverse(n, s)
    u1 = (h * w) % n
    u2 = (r * w) % n
    u1P = scalar_multiply(u1, P, curve)
    u2Q = scalar_multiply(u2, Q, curve)
    add_u1P_u2Q = point_add(u1P, u2Q, curve)
    v = add_u1P_u2Q[0] % n
    return (v, r, v == r)

def count_points_on_curve_with_prime_modulo(p: int, a: int, b: int) -> int:
    count = 0
    if count is not None:
        return count
    
    count = 0
    for x in range(p):
        y2 = (x**3 + a*x + b) % p
        if y2 == 0:
            count += 1
            continue
        j = legendre_symbol(p, y2)
        if j == 1:
            count += 2
    count += 1
    return count

def find_order(P, curve):
    """
    Find the order of a point on the curve
    Args:
        P: Point to find the order of
        curve: Curve parameters (a, b, p)
    Returns:
        The order of the point
    """
    if P is None:
        return 1
    order = 1
    Q = P
    while Q:
        Q = point_add(Q, P, curve)
        order += 1
    return order