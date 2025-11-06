from . import db
from datetime import datetime


class Swap(db.Model):
    __tablename__ = 'swaps'

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    responder_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'requester_id': self.requester_id,
            'responder_id': self.responder_id,
            'event_id': self.event_id,
            'status': self.status,
        }
