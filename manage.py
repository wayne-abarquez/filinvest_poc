from flask.ext.script import Manager, prompt_bool
from flask.ext.migrate import Migrate, MigrateCommand

from app import app
from app import db
from app.seeder.base_seeder import BaseSeeder
from app.authentication.models import Role, User
from app.selling.models import PropertyType, Property, PropertyLocation


manager = Manager(app)
migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def initdb():
    db.create_all()
    print "Initialized the Database"


@manager.command
def dropdb():
    if prompt_bool("Are you sure you want to Drop your Database?"):
        db.drop_all()
        print "Database Dropped"

@manager.command
def populatedb():
    BaseSeeder.load_data()

@manager.command
def load_locations():
    BaseSeeder.load_locations_data()

if __name__ == '__main__':
    manager.run()
