from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from .fields import *
from app import rest_api
from .services import get_property_types, get_property_locations, get_property_for_user, get_property_by_filter
from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class PropertyTypeResource(Resource):
    """
    Resource for getting all Property Type
    """

    @marshal_with(property_type_fields)
    def get(self):
        """ GET /api/property_types """
        return get_property_types()


class PropertyLocationResource(Resource):
    """
    Resource for getting all Property Location
    """

    @marshal_with(property_location_fields)
    def get(self):
        """ GET /api/property_locations """
        return get_property_locations()



class PropertyResource(Resource):
    """
    Resource for getting all Property based on User's role
    """

    @marshal_with(property_complete_fields)
    def get(self):
        """ GET /api/properties """
        # try:
        args = request.args.to_dict(flat=True)
        log.debug("Get Properties args: {0}".format(args))
        if args:
            return get_property_by_filter(args)
        else:
            return get_property_for_user(current_user)
        # except scip_service.UserNotAuthorizedError:
        # abort(401, message="Requires user to login")
        # except scip_service.UserRoleInvalidError as err:
        # abort(403, message=err.message)
        # return get_property_for_user()


rest_api.add_resource(PropertyLocationResource, '/api/property_locations')
rest_api.add_resource(PropertyTypeResource, '/api/property_types')
rest_api.add_resource(PropertyResource, '/api/properties')
