from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

# Import models so they are registered when models package is imported
from .user_model import User  # noqa: F401
from .event_model import Event  # noqa: F401
from .swap_model import Swap    # noqa: F401
from .swap_request_model import SwapRequest  # noqa: F401
