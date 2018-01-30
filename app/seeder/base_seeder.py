from app import app, db
from app.authentication.models import Role, User
from app.selling.models import PropertyType, Property, PropertyLocation
from app.utils.forms_helper import parse_coordinates
from app.utils.gis_json_fields import PointToLatLng
import json
import time
import requests
from sqlalchemy import and_


class BaseSeeder:
    @staticmethod
    def refresh_table(table_name):
        db.session.execute('TRUNCATE "' + table_name + '" RESTART IDENTITY CASCADE')
        db.session.commit()


    @staticmethod
    def load_user_roles():
        # truncate table
        BaseSeeder.refresh_table('role')
        roles = []
        with open('./app/seeder/datasource/roles.json') as json_data:
            for item in list(json.load(json_data)):
                roles.append({'name': item['name'].lower()})

        db.session.bulk_insert_mappings(Role, roles)
        db.session.commit()
        print "User Roles loaded."


    @staticmethod
    def load_users():
        BaseSeeder.load_user_roles()
        # truncate table
        BaseSeeder.refresh_table('user')
        users = []
        password = 'password123'
        with open('./app/seeder/datasource/users.json') as json_data:
            for item in list(json.load(json_data)):
                u = User.from_dict({'username': item['username'].lower(), 'role_id': item['role_id']})
                u.password = password
                users.append(u)
        db.session.add_all(users)
        db.session.commit()
        print "Users loaded."


    @staticmethod
    def load_property_types():
        # truncate table
        BaseSeeder.refresh_table('property_type')
        types = []
        with open('./app/seeder/datasource/properties.json') as json_data:
            for item in list(json.load(json_data)):
                if item['type'].lower() not in types:
                    types.append(item['type'].lower())

        db.session.bulk_insert_mappings(PropertyType, map(lambda t: {'name': t}, types))
        db.session.commit()
        print "Property Types loaded."


    @staticmethod
    def load_properties():
        # truncate table
        BaseSeeder.refresh_table('property')
        properties = []
        with open('./app/seeder/datasource/properties.json') as json_data:
            for item in list(json.load(json_data)):
                type = PropertyType.query.filter_by(name=item['type'].lower()).first()
                prop = {
                    'name': item['name'].title(),
                    'typeid': type.id,
                    'price': item['price'],
                    'latlng': parse_coordinates({'lat': item['lat'], 'lng': item['lng']})
                }
                properties.append(prop)
        db.session.bulk_insert_mappings(Property, properties)
        db.session.commit()
        print "Properties loaded."


    @staticmethod
    def get_city(address_component):
        find = set(['locality'])
        for component in address_component:
            if (len(set(component['types']).intersection(find)) > 0):
                return component['long_name'] if 'long_name' in component else component['short_name']


    @staticmethod
    def get_province(address_component):
        find = set(['administrative_area_level_1', 'administrative_area_level_2'])
        for component in address_component:
            if (len(set(component['types']).intersection(find))):
                return component['long_name'] if 'long_name' in component else component['short_name']


    @staticmethod
    def load_locations_data():
        start_time = time.time()

        pointToLatLng = PointToLatLng()
        for item in Property.query.all():
            latlng = pointToLatLng.format(item.latlng)

            url = 'https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&key=' + app.config.get('GOOGLE_MAP_API_KEY') + '&latlng=' + str(latlng['lat']) + ',' + str(latlng['lng'])
            response = requests.get(url, verify=False)

            try:
                if response.content:
                    content = json.loads(response.content)
                    if content['status'] == 'OK' and len(content['results']) > 0:
                        res = content['results'].pop()
                        address_components = res['address_components']
                        city = BaseSeeder.get_city(address_components)
                        province = BaseSeeder.get_province(address_components)
                        result_location = {'city': city, 'province': province}
                        print "RESULT LOCATION: {0}".format(result_location)
                        pl = PropertyLocation.query.filter(and_(PropertyLocation.city==result_location['city'],
                                                                PropertyLocation.province==result_location['province'])).first()
                        if pl is None:
                            db.session.add(PropertyLocation.from_dict(result_location))
                            db.session.commit()
                time.sleep(0.2)  # sleep for 200 milliseconds
            except Exception as err:
                print "EXCEPTION: {0}".format(err.message)
                continue

        print("--- finished in %s seconds ---" % (time.time() - start_time))


    @staticmethod
    def load_data():
        BaseSeeder.load_users()
        BaseSeeder.load_property_types()
        BaseSeeder.load_properties()
