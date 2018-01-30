from app import db
from app.models import BaseModel, OrmObject
from flask.ext.login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class RoleType:
    ADMIN = "admin"
    PM = "pm"
    SALES = "sales"


class Role(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), index=True, unique=True, nullable=False)


class User(BaseModel, UserMixin):
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), index=True)
    name = db.Column(db.String(200))
    username = db.Column(db.String(50), index=True, unique=True)
    password_hash = db.Column(db.String)
    last_login_datetime = db.Column(db.DateTime)

    role = db.relationship(Role, foreign_keys=role_id)

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def authenticate(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def get_by_username(username):
        return User.query.filter_by(username=username).first()

    def __repr__(self):
        return "<User '{}'>".format(self.username)
