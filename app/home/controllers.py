from . import home
from flask import send_file # , render_template
import logging

log = logging.getLogger(__name__)


@home.route('/', methods=['GET', 'POST'])
def index():
    return send_file('./../client/templates/base.html')
