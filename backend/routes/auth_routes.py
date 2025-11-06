from flask import Blueprint, request, jsonify, current_app
from models.user_model import User
from models import db
import jwt
from config import Config

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 400

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User created', 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

    payload = {'sub': user.id}
    token = jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

    return jsonify({'token': token, 'user': user.to_dict()}), 200
