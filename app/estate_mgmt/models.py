from app import db
from app.utils.orm_object import OrmObject
from app.models import BaseModel
from geoalchemy2 import Geometry


class AssetType(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), index=True, unique=True, nullable=False)


class AssetStatus:
    ACTIVE = 'active'
    INACTIVE = 'inactive'


class Asset(BaseModel):
    typeid = db.Column(db.Integer, db.ForeignKey('asset_type.id'), index=True, nullable=False)
    latlng = db.Column(Geometry('POINT'), nullable=False)
    recstat = db.Column(db.String(10), nullable=False, default=AssetStatus.ACTIVE)
