import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret')
    DEBUG = os.environ.get('FLASK_DEBUG', '1') == '1'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///slot_swapper.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # JWT settings
    JWT_SECRET = os.environ.get('JWT_SECRET', os.environ.get('SECRET_KEY', 'dev-secret'))
    JWT_EXP_SECONDS = int(os.environ.get('JWT_EXP_SECONDS', 60 * 60 * 24))  # default 1 day
