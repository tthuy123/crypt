from flask import Blueprint, request, jsonify
from app.services.math_utils import prime_factors, find_primitive_element
from app.services.elgamal import key_generate_elgamal, encrypt_elgamal, decrypt_elgamal

bp = Blueprint('elgamal', __name__, url_prefix='/api/elgamal')

@bp.route('/factors', methods=['POST'])
def calculate_factors():
    data = request.json
    if 'n' not in data:
        return jsonify({"error": "Missing 'n' parameter"}), 400

    try:
        n = int(data['n'])
        factors = prime_factors(n)
        return jsonify({"number": n, "factors": list(factors)})
    except ValueError:
        return jsonify({"error": "Invalid input. 'n' must be an integer"}), 400

@bp.route('/primitive-element', methods=['POST'])
def calculate_primitive_root():
    data = request.json
    if 'n' not in data:
        return jsonify({"error": "Missing 'n' parameter"}), 400

    try:
        n = int(data['n'])
        primitive_root = find_primitive_element(n)
        return jsonify({"number": n, "primitive_root": primitive_root})
    except ValueError:
        return jsonify({"error": "Invalid input. 'n' must be an integer"}), 400

@bp.route('/key-generate', methods=['POST'])
def key_generate():
    data = request.json
    if 'p' not in data or 'alpha' not in data or 'a' not in data:
        return jsonify({"error": "Missing required parameters: p, alpha, a"}), 400

    p = data['p']
    alpha = data['alpha']
    a = data['a']

    try:
        private_key, public_key = key_generate_elgamal(p, alpha, a)
        return jsonify({
            "private_key": private_key,
            "public_key": public_key
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.json
    if 'p' not in data or 'alpha' not in data or 'a' not in data or 'x' not in data or 'k' not in data:
        return jsonify({"error": "Missing required parameters: p, alpha, a, x, k"}), 400

    p = data['p']
    alpha = data['alpha']
    a = data['a']
    x = data['x']
    k = data['k']

    try:
        y1, y2 = encrypt_elgamal(p, alpha, a, x, k)
        return jsonify({
            "y1": y1,
            "y2": y2
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.json
    if 'p' not in data or 'a' not in data or 'y1' not in data or 'y2' not in data:
        return jsonify({"error": "Missing required parameters: p, a, y1, y2"}), 400

    p = data['p']
    a = data['a']
    y1 = data['y1']
    y2 = data['y2']

    try:
        decrypted_message = decrypt_elgamal(p, a, y1, y2)
        return jsonify({
            "decrypted_message": decrypted_message
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
