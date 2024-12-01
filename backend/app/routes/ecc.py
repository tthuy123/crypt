from flask import Blueprint, request, jsonify
# from app.services.math_utils import prime_factors, find_primitive_element
from app.services.ecc import point_add

bp = Blueprint('ecc', __name__, url_prefix='/api/ecc')

@bp.route('/add', methods=['POST'])
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
        return jsonify({"result": result})
    except ValueError:
        return jsonify({"error": "Invalid input. Parameters must be integers"}), 400