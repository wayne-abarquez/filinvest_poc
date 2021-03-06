"""empty message

Revision ID: 59a507a2a971
Revises: None
Create Date: 2018-01-30 18:14:51.955968

"""

# revision identifiers, used by Alembic.
revision = '59a507a2a971'
down_revision = None

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('property_location',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('city', sa.String(length=200), nullable=False),
    sa.Column('province', sa.String(length=200), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_property_location_city'), 'property_location', ['city'], unique=False)
    op.create_index(op.f('ix_property_location_province'), 'property_location', ['province'], unique=False)

    op.create_table('property_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_property_type_name'), 'property_type', ['name'], unique=True)

    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_role_name'), 'role', ['name'], unique=True)

    op.create_table('property',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('typeid', sa.Integer(), nullable=False),
    sa.Column('latlng', geoalchemy2.types.Geometry(geometry_type='POINT'), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('status', sa.String(length=10), nullable=False),
    sa.ForeignKeyConstraint(['typeid'], ['property_type.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_property_name'), 'property', ['name'], unique=False)
    op.create_index(op.f('ix_property_typeid'), 'property', ['typeid'], unique=False)
    op.execute('CREATE INDEX ix_property_latlng  ON property USING gist(latlng);')

    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=200), nullable=True),
    sa.Column('username', sa.String(length=50), nullable=True),
    sa.Column('password_hash', sa.String(), nullable=True),
    sa.Column('last_login_datetime', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_role_id'), 'user', ['role_id'], unique=False)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_role_id'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_property_typeid'), table_name='property')
    op.drop_index(op.f('ix_property_name'), table_name='property')
    op.drop_index(op.f('ix_property_latlng'), table_name='property')
    op.drop_table('property')
    op.drop_index(op.f('ix_role_name'), table_name='role')
    op.drop_table('role')
    op.drop_index(op.f('ix_property_type_name'), table_name='property_type')
    op.drop_table('property_type')
    op.drop_index(op.f('ix_property_location_province'), table_name='property_location')
    op.drop_index(op.f('ix_property_location_city'), table_name='property_location')
    op.drop_table('property_location')
    ### end Alembic commands ###
