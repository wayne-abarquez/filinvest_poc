from app import db
from app.utils.orm_object import OrmObject
from app.models import BaseModel
from geoalchemy2 import Geometry


class PropertyType(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), index=True, unique=True, nullable=False)


class PropertyStatus():
    AVAILABLE = 'available'
    SOLD = 'sold'


class Property(BaseModel):
    name = db.Column(db.String(200), index=True, nullable=False)
    typeid = db.Column(db.Integer, db.ForeignKey('property_type.id'), index=True, nullable=False)
    latlng = db.Column(Geometry('POINT'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(10), nullable=False, default=PropertyStatus.AVAILABLE)

    type = db.relationship(PropertyType, foreign_keys=typeid)


class PropertyLocation(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(200), index=True, nullable=False)
    province = db.Column(db.String(200), index=True, nullable=False)
