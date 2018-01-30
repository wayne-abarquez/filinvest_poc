from .models import PropertyType, Property, PropertyLocation
from app.utils import forms_helper
import logging

log = logging.getLogger(__name__)


def get_property_types():
    return PropertyType.query.all()


def get_property_locations():
    return PropertyLocation.query.all()


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
