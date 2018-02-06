from flask.ext.restful import fields
from app.utils.gis_json_fields import PointToLatLng
from copy import copy


property_type_fields = dict(
    id=fields.Integer,
    name=fields.String
)

property_fields = dict(
    id=fields.Integer,
    typeid=fields.Integer,
    name=fields.String,
    location=fields.String,
    latlng=PointToLatLng(attribute='latlng'),
    price=fields.Float,
    completion=fields.Integer,
    status=fields.String,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

property_complete_fields = copy(property_fields)
property_complete_fields['type'] = fields.Nested(property_type_fields)

property_location_fields = dict(
    id=fields.Integer,
    city=fields.String,
    province=fields.String
)
