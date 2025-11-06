from flask import Blueprint, request, jsonify, g
from models.event_model import Event
from models import db
from utils.token_required import token_required
from datetime import datetime

event_bp = Blueprint('events', __name__)


@event_bp.route('/', methods=['GET'])
@token_required
def list_events():
    user = g.current_user
    events = Event.query.filter_by(owner_id=user.id).all()
    return jsonify([e.to_dict() for e in events])


@event_bp.route('/', methods=['POST'])
@token_required
def create_event():
    user = g.current_user
    data = request.json or {}
    title = data.get('title')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    description = data.get('description')

    if not title or not start_time or not end_time:
        return jsonify({'message': 'title, start_time and end_time required'}), 400

    try:
        st = datetime.fromisoformat(start_time)
        et = datetime.fromisoformat(end_time)
    except Exception:
        return jsonify({'message': 'Invalid datetime format. Use ISO format.'}), 400

    event = Event(title=title, description=description, start_time=st, end_time=et, owner_id=user.id)
    db.session.add(event)
    db.session.commit()
    return jsonify({'message': 'event created', 'event': event.to_dict()}), 201


@event_bp.route('/<int:event_id>', methods=['PUT'])
@token_required
def update_event(event_id):
    user = g.current_user
    event = db.session.get(Event, event_id)
    if not event or event.owner_id != user.id:
        return jsonify({'message': 'Event not found'}), 404

    data = request.json or {}
    # allow changing title, description, start/end, status
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'start_time' in data:
        event.start_time = datetime.fromisoformat(data['start_time'])
    if 'end_time' in data:
        event.end_time = datetime.fromisoformat(data['end_time'])
    if 'status' in data:
        event.status = data['status']

    db.session.commit()
    return jsonify({'message': 'Event updated', 'event': event.to_dict()})


@event_bp.route('/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(event_id):
    user = g.current_user
    event = db.session.get(Event, event_id)
    if not event or event.owner_id != user.id:
        return jsonify({'message': 'Event not found'}), 404
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted'})
