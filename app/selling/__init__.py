from flask import Blueprint

selling = Blueprint('selling', __name__)

from . import resources
