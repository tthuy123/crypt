from flask import Blueprint, request, jsonify
from app.services.ecc import find_order, ecdsa_sign, ecdsa_verify, is_valid_k, hash_message

bp = Blueprint('ecdsa', __name__, url_prefix='/api/ecdsa')

@bp.route('/check-k', methods=['POST'])
def check_k():
    data = request.json
    required_params = ['pX', 'pY', 'n', 'd', 'a', 'b', 'p', 'message', 'k']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400
    
    try:
        k = int(data['k'])
        P = (int(data['pX']), int(data['pY']))
        n = int(data['n'])
        d = int(data['d'])
        message = data['message']
        curve = (int(data['a']), int(data['b']), int(data['p']))
        private_key = P, n, d, curve

        result = is_valid_k(k, message, private_key, curve)

        return jsonify({"result": result})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('hash', methods=['POST'])
def hash():
    data = request.json
    required_params = ['message']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        message = data['message']
        hashed_message = hash_message(message)

        return jsonify({"hashed_message": str(hashed_message)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/find-order', methods=['POST'])
def find_order_route():
    data = request.json
    required_params = ['pX', 'pY', 'a', 'b', 'p']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        P = (int(data['pX']), int(data['pY']))
        curve = (int(data['a']), int(data['b']), int(data['p']))
        result = find_order(P, curve)

        return jsonify({"result": result})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/sign', methods=['POST'])
def sign():
    data = request.json
    required_params = ['pX', 'pY', 'n', 'd', 'a', 'b', 'p', 'k', 'message']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400
        
    try:
        k = int(data['k'])
        private_key = ((int(data['pX']), int(data['pY'])), int(data['n']), int(data['d']), (int(data['a']), int(data['b']), int(data['p'])))
        curve = (int(data['a']), int(data['b']), int(data['p']))
        message = data['message']

        signature = ecdsa_sign(message, k, private_key, curve)

        return jsonify({"signature": {
            "r": str(signature[0]),
            "s": str(signature[1])
        }})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/verify', methods=['POST'])
def verify():
    data = request.json
    required_params = ['pX', 'pY', 'qX', 'qY', 'n', 'a', 'b', 'p', 'r', 's', 'message']

    for param in required_params:
        if param not in data:
            return jsonify({"error": f"Missing parameter: {param}"}), 400

    try:
        P = (int(data['pX']), int(data['pY']))
        Q = (int(data['qX']), int(data['qY']))
        n = int(data['n'])
        curve = (int(data['a']), int(data['b']), int(data['p']))
        r = int(data['r'])
        s = int(data['s'])
        message = data['message']

        signature = r, s
        public_key = P, Q, n, curve

        result = ecdsa_verify(message, signature, public_key)

        return jsonify({"result": {
            "v": result[0],
            "r": result[1],
            "valid": result[2]
        }})

    except ValueError as ve:
        return jsonify({"error": f"Invalid input. Parameters must be integers: {str(ve)}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400
