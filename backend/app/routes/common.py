from flask import Blueprint, request, jsonify
from app.services.math_utils import modular_pow, modular_inverse, is_prime

bp = Blueprint('common', __name__, url_prefix='/api/common')

@bp.route('/pow', methods=['POST'])
def calculate_pow():
    data = request.json
    if 'base' not in data or 'exponent' not in data or 'modulus' not in data:
        return jsonify({"error": "Missing 'base', 'exponent', or 'modulus' parameter"}), 400

    try:
        base = int(data['base'])
        exponent = int(data['exponent'])
        modulus = int(data['modulus'])

        result = modular_pow(base, exponent, modulus)
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

        result = modular_inverse(a, b)
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
        return jsonify({"n": n, "is_prime": result})

    except ValueError:
        return jsonify({"error": "Invalid input. 'n' must be an integer"}), 400