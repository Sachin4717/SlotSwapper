from flask import Blueprint, request, jsonify, g
from models.event_model import Event
from models.swap_request_model import SwapRequest
from models import db
from utils.token_required import token_required

swap_bp = Blueprint('swaps', __name__)


@swap_bp.route('/swappable-slots', methods=['GET'])
@token_required
def swappable_slots():
    user = g.current_user
    slots = Event.query.filter(Event.owner_id != user.id, Event.status == Event.STATUS_SWAPPABLE).all()
    return jsonify([s.to_dict() for s in slots])


@swap_bp.route('/swap-request', methods=['POST'])
@token_required
def create_swap_request():
    user = g.current_user
    data = request.json or {}
    my_slot_id = data.get('mySlotId')
    their_slot_id = data.get('theirSlotId')

    if not my_slot_id or not their_slot_id:
        return jsonify({'message': 'mySlotId and theirSlotId are required'}), 400

    my_slot = db.session.get(Event, my_slot_id)
    their_slot = db.session.get(Event, their_slot_id)

    if not my_slot or not their_slot:
        return jsonify({'message': 'One or both slots not found'}), 404

    if my_slot.owner_id != user.id:
        return jsonify({'message': 'mySlot must belong to the authenticated user'}), 403

    # Verify both are swappable
    if my_slot.status != Event.STATUS_SWAPPABLE or their_slot.status != Event.STATUS_SWAPPABLE:
        return jsonify({'message': 'Both slots must be SWAPPABLE'}), 400

    # Create swap request and mark slots as pending
    swap_request = SwapRequest(
        requester_id=user.id,
        responder_id=their_slot.owner_id,
        my_slot_id=my_slot.id,
        their_slot_id=their_slot.id,
        status='PENDING'
    )
    try:
        my_slot.status = Event.STATUS_SWAP_PENDING
        their_slot.status = Event.STATUS_SWAP_PENDING
        db.session.add(swap_request)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create swap request', 'error': str(e)}), 500

    return jsonify({'message': 'Swap request created', 'request': swap_request.to_dict()}), 201


@swap_bp.route('/swap-response/<int:request_id>', methods=['POST'])
@token_required
def respond_to_swap(request_id):
    user = g.current_user
    data = request.json or {}
    accept = data.get('accept')

    sr = db.session.get(SwapRequest, request_id)
    if not sr:
        return jsonify({'message': 'Swap request not found'}), 404

    # Only responder (the owner of their_slot) can respond
    if sr.responder_id != user.id:
        return jsonify({'message': 'Not authorized to respond to this request'}), 403

    if sr.status != 'PENDING':
        return jsonify({'message': 'Swap request is not pending'}), 400

    my_slot = db.session.get(Event, sr.my_slot_id)
    their_slot = db.session.get(Event, sr.their_slot_id)

    if accept:
        # Ensure slots still pending and belong to expected owners
        if my_slot.status != Event.STATUS_SWAP_PENDING or their_slot.status != Event.STATUS_SWAP_PENDING:
            return jsonify({'message': 'Slots are not in swap-pending state'}), 400

        try:
            # Swap ownership
            temp_owner = my_slot.owner_id
            my_slot.owner_id = their_slot.owner_id
            their_slot.owner_id = temp_owner

            # Set both slots back to BUSY
            my_slot.status = Event.STATUS_BUSY
            their_slot.status = Event.STATUS_BUSY

            sr.status = 'ACCEPTED'
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to accept swap', 'error': str(e)}), 500

        return jsonify({'message': 'Swap accepted', 'request': sr.to_dict()})
    else:
        # Revert statuses
        try:
            if my_slot:
                my_slot.status = Event.STATUS_SWAPPABLE
            if their_slot:
                their_slot.status = Event.STATUS_SWAPPABLE
            sr.status = 'REJECTED'
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to reject swap', 'error': str(e)}), 500

        return jsonify({'message': 'Swap rejected', 'request': sr.to_dict()})


@swap_bp.route('/swap-requests', methods=['GET'])
@token_required
def list_swap_requests():
    user = g.current_user
    incoming = SwapRequest.query.filter_by(responder_id=user.id).all()
    outgoing = SwapRequest.query.filter_by(requester_id=user.id).all()
    return jsonify({
        'incoming': [r.to_dict() for r in incoming],
        'outgoing': [r.to_dict() for r in outgoing]
    })
