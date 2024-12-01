def encrypt_single(s):
    s = s.replace(" ", "").upper()
    n = len(s)
    sum = 0
    for i in range(n):
        sum += (ord(s[i]) - 64) * (26 ** (n - i - 1))
    return sum

def encrypt_string(s, n):
    s = s.replace(" ", "").upper()
    padding_length = (n - len(s) % n) % n
    s += 'X' * padding_length
    encrypted_values = []
    for i in range(0, len(s), n):
        part = s[i:i + n]
        encrypted_values.append(encrypt_single(part))
    return encrypted_values

def decrypt(n):
    s = ""
    while n > 0:
        value = (n % 26)
        if value == 0:
            value = 26
            n -= 26
        s = chr(value + 64) + s
        n //= 26
    return s

def decrypt_string(encrypted_values):
    decrypted_string = ""
    for encrypted_value in encrypted_values:
        part = decrypt(encrypted_value)
        decrypted_string += part
    decrypted_string = decrypted_string.rstrip('X')
    return decrypted_string

