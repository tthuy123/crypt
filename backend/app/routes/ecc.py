from flask import Blueprint, request, jsonify
from app.services.ecc import point_add, scalar_multiply, is_on_curve, ecc_encrypt, ecc_decrypt, ecc_generate_keypair, count_points_on_curve_with_prime_modulo, get_point_from_message

bp = Blueprint('ecc', __name__, url_prefix='/api/ecc')

@bp.route('/count-point', methods=['POST'])
def count_points():
    data = request.json
    required_params = ['a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        a, b, p = (int(data['a']), int(data['b']), int(data['p']))
        result = count_points_on_curve_with_prime_modulo(p, a, b)
        return jsonify({"result": result})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/point-add', methods=['POST'])
def add_points():
    data = request.json
    required_params = ['pX', 'pY', 'qX', 'qY', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        P = (int(data['pX']), int(data['pY']))
        Q = (int(data['qX']), int(data['qY']))
        curve = (int(data['a']), int(data['b']), int(data['p']))
        result = point_add(P=P, Q=Q, curve=curve)
        return jsonify({"result": {
            "x": str(result[0]),
            "y": str(result[1])
        }})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400
    
@bp.route('/point-multiply', methods=['POST'])
def multiply_point():
    data = request.json
    required_params = ['k', 'pX', 'pY', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        P = (int(data['pX']), int(data['pY']))
        k = int(data['k'])
        curve = (int(data['a']), int(data['b']), int(data['p']))
        result = scalar_multiply(k=k, P=P, curve=curve)
        return jsonify({"result": {
            "x": str(result[0]),
            "y": str(result[1])
        }})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400
    
@bp.route('/point-on-curve', methods=['POST'])
def check_point_on_curve():
    data = request.json
    required_params = ['pX', 'pY', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        point = (int(data['pX']), int(data['pY']))
        curve = (int(data['a']), int(data['b']), int(data['p']))
        result = is_on_curve(point, curve)
        return jsonify({"result": result})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400
    
@bp.route('/generate-keypair', methods=['POST'])
def generate_keypair():
    data = request.json
    required_params = ['pX', 'pY', 's', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        P = (int(data['pX']), int(data['pY']))
        s = int(data['s'])
        curve = (int(data['a']), int(data['b']), int(data['p']))
        result = ecc_generate_keypair(P, s, curve)
        return jsonify({"result": {
            "private_key": {
                "s": str(result[0][0]),
                "pX": str(result[0][1][0]),
                "pY": str(result[0][1][1]),
                "a": str(result[0][2][0]),
                "b": str(result[0][2][1]),
                "p": str(result[0][2][2])
                
            },
            "public_key": {
                "pX": str(result[1][0][0]),
                "pY": str(result[1][0][1]),
                "bX": str(result[1][1][0]),
                "bY": str(result[1][1][1]),
                "a": str(result[1][2][0]),
                "b": str(result[1][2][1]),
                "p": str(result[1][2][2])
            }
        }
        })
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400

@bp.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.json
    required_params = ['k', 'mX', 'mY', 'pX', 'pY', 'bX', 'bY', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        M = (int(data['mX']), int(data['mY']))
        k = int(data['k'])
        public_key = ((int(data['pX']), int(data['pY'])), (int(data['bX']), int(data['bY'])), (int(data['a']), int(data['b']), int(data['p'])))
        result = ecc_encrypt(M, k, public_key)
        return jsonify({"result": {
            "m1X": str(result[0][0]),
            "m1Y": str(result[0][1]),
            "m2X": str(result[1][0]),
            "m2Y": str(result[1][1])
        }})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    

@bp.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.json
    required_params = ['m1X', 'm1Y', 'm2X', 'm2Y', 's', 'pX', 'pY', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        M1 = (int(data['m1X']), int(data['m1Y']))
        M2 = (int(data['m2X']), int(data['m2Y']))
        private_key = (int(data['s']), (int(data['pX']), int(data['pY'])), (int(data['a']), int(data['b']), int(data['p'])))
        result = ecc_decrypt((M1, M2), private_key)
        return jsonify({"result": {
            "x": str(result[0]),
            "y": str(result[1])
        }})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    

def legendre(A: int, B: int):
    if B % 2 == 0:
        raise RuntimeError(f"invalid B = {B}")

    if B == 1:
        return 1

    if A % B == 0:
        return 0

    if A == 1:
        return 1

    r = pow(A % B, (B - 1) // 2, B)
    if r == 1:
        return 1
    elif r == B - 1:
        return -1
    else:
        return 0

@bp.route('/get-message-point', methods=['POST'])
def get_message_point():
    data = request.json
    required_params = ['message', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        message = int(data['message'])
        curve = (int(data['a']), int(data['b']), int(data['p']))
        result = get_point_from_message(message, curve)
        return jsonify({"result": {
            "x": str(result[0]),
            "y": str(result[1])
        }})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400