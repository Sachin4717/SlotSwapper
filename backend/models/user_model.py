from . import db
from datetime import datetime, timezone
import bcrypt


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    # Use timezone-aware UTC timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def set_password(self, password: str):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password: str) -> bool:
        try:
            return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
        except Exception:
            return False

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
        }
