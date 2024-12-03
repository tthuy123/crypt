from flask import Blueprint, request, jsonify
from app.services.math_utils import modular_pow, modular_inverse, is_prime, generate_prime
from app.services.text import encrypt_single, encrypt_string, decrypt, decrypt_string
from math import gcd

bp = Blueprint('common', __name__, url_prefix='/api/common')

@bp.route('/generate-prime', methods=['POST'])
def generate_prime1():
    data = request.json
    if 'n' not in data:
        return jsonify({"error": "Missing 'n' parameter"}), 400

    try:
        n = int(data['n'])
        result = str(generate_prime(n))
        return jsonify({"n": n, "result": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'a', 'b'"}), 400
    
@bp.route('/sum', methods=['POST'])

def calculate_sum():
    data = request.json
    if 'a' not in data or 'b' not in data:
        return jsonify({"error": "Missing 'a' or 'b' parameter"}), 400

    try:
        a = int(data['a'])
        b = int (data['b'])
        result = str(a + b)
        return jsonify({"a": a, "b": b, "result": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'a', 'b'"}), 400

@bp.route('/gcd', methods=['POST'])
def calculate_gcd():
    data = request.json
    if 'a' not in data or 'b' not in data:
        return jsonify({"error": "Missing 'a' or 'b' parameter"}), 400

    try:
        a = int(data['a'])
        b = int (data['b'])
        result = str(gcd(a, b))
        return jsonify({"a": a, "b": b, "result": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'a', 'b'"}), 400
@bp.route('/product', methods=['POST'])

def calculate_product():
    data = request.json
    if 'a' not in data or 'b' not in data:
        return jsonify({"error": "Missing 'a' or 'b' parameter"}), 400

    try:
        a = int(data['a'])
        b = int (data['b'])
        result = str(a * b)
        return jsonify({"a": a, "b": b, "result": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'a', 'b'"}), 400
    
@bp.route('/pow', methods=['POST'])
def calculate_pow():
    data = request.json
    if 'base' not in data or 'exponent' not in data or 'modulus' not in data:
        return jsonify({"error": "Missing 'base', 'exponent', or 'modulus' parameter"}), 400

    try:
        base = int(data['base'])
        exponent = int(data['exponent'])
        modulus = int(data['modulus'])

        result = str(modular_pow(base, exponent, modulus))
        return jsonify({"base": base, "exponent": exponent, "modulus": modulus, "result": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'base', 'exponent', and 'modulus' must be integers"}), 400

@bp.route('/modular-inverse', methods=['POST'])
def calculate_inverse():
    data = request.json
    if 'a' not in data or 'b' not in data:
        return jsonify({"error": "Missing 'a' or 'b' parameter"}), 400

    try:
        a = int(data['a'])
        b = int(data['b'])

        result = str(modular_inverse(a, b))
        if result is None:
            return jsonify({"error": f"No modular inverse for {a} and {b} (GCD != 1)"}), 400
        else:
            return jsonify({"a": a, "b": b, "modular_inverse": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'a' and 'b' must be integers"}), 400
    
@bp.route('/prime', methods=['POST'])
def check_prime():
    data = request.json
    if 'n' not in data:
        return jsonify({"error": "Missing 'n' parameter"}), 400

    try:
        n = int(data['n'])
        result = is_prime(n)
        return jsonify({"n": str(n), "is_prime": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'n' must be an integer"}), 400
    
@bp.route('/encrypt', methods=['POST'])
def encrypt():
    # Lấy dữ liệu từ request body
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in request body"}), 400
    
    text = data['text']
    try:
        encrypted_value = encrypt_single(text)
        return jsonify({"encrypted_value": str(encrypted_value)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/encrypt-string', methods=['POST'])
def encrypt_string():
    data = request.get_json()
    if not data or 'text' not in data or 'n' not in data:
        return jsonify({"error": "Missing 'text' or 'n' field in request body"}), 400
    
    text = data['text']
    n = data['n']
    try:
        encrypted_values = encrypt_string(text, n)
        return jsonify({"encrypted_values": encrypted_values}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/decrypt', methods=['POST'])
def decrypt_route():
    # Lấy dữ liệu từ request body
    data = request.get_json()
    if not data or 'number' not in data:
        return jsonify({"error": "Missing 'number' field in request body"}), 400
    
    try:
        # Đảm bảo 'number' là số nguyên
        number = int(data['number'])
        print(number)
        result = decrypt(number)
        return jsonify({"decrypted_value": result}), 200
    except ValueError:
        return jsonify({"error": "'number' must be an integer"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/decrypt-string', methods=['POST'])
def decrypt_string():
    data = request.get_json()
    if not data or 'encrypted_values' not in data:
        return jsonify({"error": "Missing 'encrypted_values' field in request body"}), 400
    
    encrypted_values = data['encrypted_values']
    try:
        decrypted_text = decrypt_string(encrypted_values)
        return jsonify({"decrypted_text": str(decrypted_text)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500