from app import db
from app.utils.orm_object import OrmObject
from app.models import BaseModel
from geoalchemy2 import Geometry


class PropertyType(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), index=True, unique=True, nullable=False)


class PropertyStatus:
    AVAILABLE = 'available'
    SOLD = 'sold'
    READY_FOR_OCCUPANCY = 'ready for occupancy'


class ProjectStatus:
    PLANNING = 'planning'
    ONPROGRESS = 'on-progress'
    ONHOLD = 'on-hold'
    COMPLETED = 'completed'
    READY_FOR_OCCUPANCY = 'ready for occupancy'

    LIST = [PLANNING, ONHOLD, ONPROGRESS, COMPLETED, READY_FOR_OCCUPANCY]


class Project(BaseModel):
    name = db.Column(db.String(200), index=True, nullable=False)
    type = db.Column(db.String(100), index=True, nullable=False)
    latlng = db.Column(Geometry('POINT'), nullable=False)
    location = db.Column(db.String(200), index=True)
    province = db.Column(db.String(200))
    city = db.Column(db.String(200))
    full_address = db.Column(db.Text)
    completion = db.Column(db.SmallInteger, default=100, nullable=False)
    status = db.Column(db.String(50), nullable=False, default=ProjectStatus.COMPLETED)


class Property(BaseModel):
    name = db.Column(db.String(200), index=True, nullable=False)
    typeid = db.Column(db.Integer, db.ForeignKey('property_type.id'), index=True, nullable=False)
    projectid = db.Column(db.Integer, db.ForeignKey('project.id'), index=True, nullable=False)
    latlng = db.Column(Geometry('POINT'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(200), index=True)
    province = db.Column(db.String(200))
    city = db.Column(db.String(200))
    full_address = db.Column(db.Text)
    completion = db.Column(db.SmallInteger, default=100, nullable=False)
    status = db.Column(db.String(50), nullable=False, default=ProjectStatus.COMPLETED)

    type = db.relationship(PropertyType, foreign_keys=typeid)


class PropertyLocation(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(200), index=True, nullable=False)
    province = db.Column(db.String(200), index=True, nullable=False)
