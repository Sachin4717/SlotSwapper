from . import db
from datetime import datetime, timezone


class SwapRequest(db.Model):
    __tablename__ = 'swap_requests'

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    responder_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    my_slot_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    their_slot_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    status = db.Column(db.String(50), default='PENDING')  # PENDING, ACCEPTED, REJECTED
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'requester_id': self.requester_id,
            'responder_id': self.responder_id,
            'my_slot_id': self.my_slot_id,
            'their_slot_id': self.their_slot_id,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
