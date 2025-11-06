from functools import wraps
from flask import request, jsonify, g
import jwt
from config import Config
from models import db
from models.user_model import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({'message': 'Token is missing!'}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'message': 'Authorization header must be Bearer token'}), 401

        token = parts[1]
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except Exception:
            return jsonify({'message': 'Invalid token'}), 401

        # Use session.get to avoid SQLAlchemy Query.get deprecation
        user = db.session.get(User, payload.get('sub'))
        if not user:
            return jsonify({'message': 'User not found for token'}), 401

        g.current_user = user
        return f(*args, **kwargs)

    return decorated
