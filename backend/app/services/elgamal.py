from app.services.math_utils import modular_pow, modular_inverse

def key_generate_elgamal(p, alpha, a):
    # Step 1: Generate private key 'a', a random integer between 1 and p-2
    private_key = a
    
    # Step 2: Calculate the public key 'beta' where beta = alpha^a mod p
    beta = pow(alpha, private_key, p)
    
    # Step 3: Return the public and private keys
    public_key = (p, alpha, beta)
    
    return private_key, public_key
   
def encrypt_elgamal(p, alpha, a, x, k):
    beta = modular_pow(alpha, a, p)
    y1 = modular_pow(alpha, k, p)
    y2 = (x * modular_pow(beta, k, p)) % p
    print("Encrypted message: (y1, y2) = ({}, {})".format(y1, y2))
    return y1, y2

def decrypt_elgamal(p, a, y1, y2):
    x = (y2 * modular_pow(y1, p - 1 - a, p)) % p
    print("Decrypted message: {}".format(x))
    return x

def encrypt_elgamal_sig(p, alpha, a, s, k):
    y1 = pow(alpha, k, p)
    print("y1: ", y1)
    print("s: ", s)
    print("a: ", a)
    y2 = ((s - a * y1) * modular_inverse(p - 1,k)) % (p - 1)
    return y1, y2

def elgamal_check_sig(p, alpha, beta, s, y1, y2):
    return (pow(beta, y1, p) * pow(y1, y2, p)) % p == pow(alpha, s, p)
