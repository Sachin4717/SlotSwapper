from flask import Flask, jsonify
from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.event_routes import event_bp
from routes.swap_routes import swap_bp
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    # Enable CORS for API routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(event_bp, url_prefix='/api/events')
    app.register_blueprint(swap_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return jsonify({'status': 'SlotSwapper backend running'})

    @app.cli.command('init-db')
    def init_db():
        """Create the database tables."""
        with app.app_context():
            db.create_all()
            print('Initialized the database.')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=Config.DEBUG)
