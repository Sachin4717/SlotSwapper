from . import db
from datetime import datetime, timezone


class Event(db.Model):
    __tablename__ = 'events'

    STATUS_BUSY = 'BUSY'
    STATUS_SWAPPABLE = 'SWAPPABLE'
    STATUS_SWAP_PENDING = 'SWAP_PENDING'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.Column(db.String(50), default=STATUS_BUSY)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'owner_id': self.owner_id,
            'status': self.status,
        }
