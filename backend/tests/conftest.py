import os
import sys
import pytest

# Ensure backend package root is on sys.path so imports like `import app` work
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from app import create_app
from models import db
from models.user_model import User
from models.event_model import Event


@pytest.fixture(scope='session')
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def db_session(app):
    # Provide access to the DB session for direct model manipulation
    with app.app_context():
        yield db.session


def create_user(db_session, email='user@example.com', name='User', password='password'):
    u = User(email=email, name=name)
    u.set_password(password)
    db_session.add(u)
    db_session.commit()
    return u


def create_event(db_session, owner_id, title='Event', start_time=None, end_time=None, status=Event.STATUS_SWAPPABLE):
    from datetime import datetime, timedelta
    if not start_time:
        start_time = datetime.utcnow()
    if not end_time:
        end_time = start_time + timedelta(hours=1)
    ev = Event(title=title, description='', start_time=start_time, end_time=end_time, owner_id=owner_id, status=status)
    db_session.add(ev)
    db_session.commit()
    return ev
