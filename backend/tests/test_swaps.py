import json
from models.swap_request_model import SwapRequest
from models.event_model import Event


def auth_headers(client, email, password):
    # signup then login to get token
    # signup may fail if user exists; ignore non-201
    client.post('/api/auth/signup', json={'email': email, 'password': password, 'name': email.split('@')[0]})
    r = client.post('/api/auth/login', json={'email': email, 'password': password})
    data = r.get_json()
    token = data.get('token')
    return {'Authorization': f'Bearer {token}'}


def test_create_swap_request(client, db_session):
    # create users and events via API, set events to SWAPPABLE, then create swap
    headers_a = auth_headers(client, 'a@example.com', 'pass')
    headers_b = auth_headers(client, 'b@example.com', 'pass')

    ev_a_resp = client.post('/api/events/', json={
        'title': 'A event', 'description': '', 'start_time': '2025-01-01T10:00:00', 'end_time': '2025-01-01T11:00:00'
    }, headers=headers_a)
    assert ev_a_resp.status_code == 201
    ev_a = ev_a_resp.get_json().get('event')

    ev_b_resp = client.post('/api/events/', json={
        'title': 'B event', 'description': '', 'start_time': '2025-01-02T10:00:00', 'end_time': '2025-01-02T11:00:00'
    }, headers=headers_b)
    assert ev_b_resp.status_code == 201
    ev_b = ev_b_resp.get_json().get('event')

    # Set both events to SWAPPABLE via PUT
    r1 = client.put(f"/api/events/{ev_a['id']}", json={'status': Event.STATUS_SWAPPABLE}, headers=headers_a)
    assert r1.status_code == 200
    r2 = client.put(f"/api/events/{ev_b['id']}", json={'status': Event.STATUS_SWAPPABLE}, headers=headers_b)
    assert r2.status_code == 200

    # A requests swap with B's event
    req = client.post('/api/swap-request', json={'mySlotId': ev_a['id'], 'theirSlotId': ev_b['id']}, headers=headers_a)
    assert req.status_code == 201
    data = req.get_json()
    assert 'request' in data
    sr = data['request']
    assert sr['status'] == 'PENDING'


def test_accept_swap(client, db_session):
    # Create fresh users and events and perform accept flow
    headers_a = auth_headers(client, 'accept_a@example.com', 'pass')
    headers_b = auth_headers(client, 'accept_b@example.com', 'pass')

    ev_a_resp = client.post('/api/events/', json={
        'title': 'A event', 'description': '', 'start_time': '2025-02-01T10:00:00', 'end_time': '2025-02-01T11:00:00'
    }, headers=headers_a)
    ev_b_resp = client.post('/api/events/', json={
        'title': 'B event', 'description': '', 'start_time': '2025-02-02T10:00:00', 'end_time': '2025-02-02T11:00:00'
    }, headers=headers_b)
    ev_a = ev_a_resp.get_json()['event']
    ev_b = ev_b_resp.get_json()['event']

    client.put(f"/api/events/{ev_a['id']}", json={'status': Event.STATUS_SWAPPABLE}, headers=headers_a)
    client.put(f"/api/events/{ev_b['id']}", json={'status': Event.STATUS_SWAPPABLE}, headers=headers_b)

    # create swap
    r = client.post('/api/swap-request', json={'mySlotId': ev_a['id'], 'theirSlotId': ev_b['id']}, headers=headers_a)
    assert r.status_code == 201
    sr = r.get_json()['request']

    # accept as B
    resp = client.post(f"/api/swap-response/{sr['id']}", json={'accept': True}, headers=headers_b)
    assert resp.status_code == 200
    d = resp.get_json()
    assert d['request']['status'] == 'ACCEPTED'

    # verify owners swapped via direct DB query
    from models.event_model import Event as Ev
    ev_my = db_session.get(Ev, sr['my_slot_id'])
    ev_their = db_session.get(Ev, sr['their_slot_id'])
    assert ev_my.owner_id == sr['responder_id']
    assert ev_their.owner_id == sr['requester_id']


def test_reject_swap(client, db_session):
    headers_a = auth_headers(client, 'reject_a@example.com', 'pass')
    headers_b = auth_headers(client, 'reject_b@example.com', 'pass')

    ev_a_resp = client.post('/api/events/', json={
        'title': 'A2 event', 'description': '', 'start_time': '2025-03-01T10:00:00', 'end_time': '2025-03-01T11:00:00'
    }, headers=headers_a)
    ev_b_resp = client.post('/api/events/', json={
        'title': 'B2 event', 'description': '', 'start_time': '2025-03-02T10:00:00', 'end_time': '2025-03-02T11:00:00'
    }, headers=headers_b)
    ev_a = ev_a_resp.get_json()['event']
    ev_b = ev_b_resp.get_json()['event']

    client.put(f"/api/events/{ev_a['id']}", json={'status': Event.STATUS_SWAPPABLE}, headers=headers_a)
    client.put(f"/api/events/{ev_b['id']}", json={'status': Event.STATUS_SWAPPABLE}, headers=headers_b)

    req = client.post('/api/swap-request', json={'mySlotId': ev_a['id'], 'theirSlotId': ev_b['id']}, headers=headers_a)
    assert req.status_code == 201
    sr = req.get_json()['request']

    # Reject as B
    resp = client.post(f"/api/swap-response/{sr['id']}", json={'accept': False}, headers=headers_b)
    assert resp.status_code == 200
    d = resp.get_json()
    assert d['request']['status'] == 'REJECTED'

    # Verify statuses reverted to SWAPPABLE
    from models.event_model import Event as Ev
    ev_my = db_session.get(Ev, sr['my_slot_id'])
    ev_their = db_session.get(Ev, sr['their_slot_id'])
    assert ev_my.status == Ev.STATUS_SWAPPABLE
    assert ev_their.status == Ev.STATUS_SWAPPABLE
