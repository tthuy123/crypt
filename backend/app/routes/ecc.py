from flask import Blueprint, request, jsonify
# from app.services.math_utils import prime_factors, find_primitive_element
from app.services.ecc import point_add, scalar_multiply, is_on_curve, ecc_encrypt, ecc_decrypt, ecc_generate_keypair

bp = Blueprint('ecc', __name__, url_prefix='/api/ecc')

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
            "x": result[0],
            "y": result[1]
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
            "x": result[0],
            "y": result[1]
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
                "s": result[0][0],
                "pX": result[0][1][0],
                "pY": result[0][1][1],
                "a": result[0][2][0],
                "b": result[0][2][1],
                "p": result[0][2][2]
                
            },
            "public_key": {
                "pX": result[1][0][0],
                "pY": result[1][0][1],
                "bX": result[1][1][0],
                "bY": result[1][1][1],
                "a": result[1][2][0],
                "b": result[1][2][1],
                "p": result[1][2][2]
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
            "m1X": result[0][0],
            "m1Y": result[0][1],
            "m2X": result[1][0],
            "m2Y": result[1][1]
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
            "x": result[0],
            "y": result[1]
        }})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
