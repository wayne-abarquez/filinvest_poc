from .models import PropertyType, Property, PropertyLocation
from sqlalchemy import func
from app.utils import forms_helper, gis_helper
import logging

log = logging.getLogger(__name__)


def get_property_types():
    return PropertyType.query.all()


def get_property_locations():
    return PropertyLocation.query.all()


def get_property_by_bounds(bounds):
    box = gis_helper.GISHelper.bounds_to_box(bounds)

    if box is None:
        return []

    bounding_box = gis_helper.GISHelper.make_bound_box(box)

    return Property.query \
        .filter(Property.latlng.intersects(bounding_box)) \
        .all()


def get_property_by_filter(args):
    q = Property.query

    if 'bounds' in args and args['bounds']:
        return get_property_by_bounds(args['bounds'])

    if 'propertyId' in args and args['propertyId']:
        return [q.get(args['propertyId'])]

    for key, value in args.iteritems():
        print "{} : {}".format(key, value)
        if key == 'propTypeId':
            q = q.filter(Property.typeid == value)
        elif key == 'location':
            q = q.filter(func.lower(Property.location) == value.lower())

    if 'maxPrice' in args and args['maxPrice']:
        minPrice = args['minPrice'] if 'minPrice' in args and args['minPrice'] else 0
        q = q.filter(Property.price.between(minPrice, args['maxPrice']))

    return q.all()


def get_property_for_user(user=None):
    return Property.query.all()
    # if user is None or not user.is_authenticated():
    # raise UserNotAuthorizedError("Need to login")
    # if user.role_name == RoleType.FF:
    #     scips = SCIP.query.all()
    # elif user.role_name == RoleType.PM:
    #     scips = SCIP.query.filter(SCIP.project_manager_id == user.id).all()
    # elif user.role_name == RoleType.IC:
    #     scips = SCIP.query.filter(SCIP.sas_id == user.id, SCIP.status != SCRUBFormConstant.APPROVED).all()
    # elif user.role_name == RoleType.CLIENT:
    #     scips = SCIP.query.filter(SCIP.client_id == user.id, SCIP.status == SCRUBFormConstant.APPROVED).all()
    # else:
    #     raise UserRoleInvalidError("Role '{0}' not allowed".format(user.role_name))
    # return scips


# def get_detail(solar_id):
#     return Solar.query.get(solar_id)
