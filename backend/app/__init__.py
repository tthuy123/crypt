from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load config (DEV, PROD, etc.)
    app.config.from_object('config.Config')

    # Import và đăng ký Blueprint (API modules) với prefix '/api'
    from app.routes import elgamal, common
    app.register_blueprint(elgamal.bp)
    app.register_blueprint(common.bp)

    return app
