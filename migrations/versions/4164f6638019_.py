"""empty message

Revision ID: 4164f6638019
Revises: 59a507a2a971
Create Date: 2018-01-31 00:50:15.326341

"""

# revision identifiers, used by Alembic.
revision = '4164f6638019'
down_revision = '59a507a2a971'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('project',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('type', sa.String(length=100), nullable=False),
    sa.Column('latlng', geoalchemy2.types.Geometry(geometry_type='POINT'), nullable=False),
    sa.Column('location', sa.String(length=200), nullable=True),
    sa.Column('province', sa.String(length=200), nullable=True),
    sa.Column('city', sa.String(length=200), nullable=True),
    sa.Column('full_address', sa.Text(), nullable=True),
    sa.Column('status', sa.String(length=10), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_project_name'), 'project', ['name'], unique=False)
    op.create_index(op.f('ix_project_type'), 'project', ['type'], unique=False)
    op.create_index(op.f('ix_project_location'), 'project', ['location'], unique=False)
    op.execute('CREATE INDEX ix_project_latlng  ON project USING gist(latlng);')

    op.add_column('property', sa.Column('city', sa.String(length=200), nullable=True))
    op.add_column('property', sa.Column('full_address', sa.Text(), nullable=True))
    op.add_column('property', sa.Column('location', sa.String(length=200), nullable=True))
    op.add_column('property', sa.Column('projectid', sa.Integer(), nullable=False))
    op.add_column('property', sa.Column('province', sa.String(length=200), nullable=True))
    op.create_index(op.f('ix_property_projectid'), 'property', ['projectid'], unique=False)
    op.create_index(op.f('ix_property_location'), 'property', ['location'], unique=False)

    op.create_foreign_key(None, 'property', 'project', ['projectid'], ['id'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'property', type_='foreignkey')
    op.drop_index(op.f('ix_property_projectid'), table_name='property')
    op.drop_index(op.f('ix_property_location'), table_name='property')
    op.drop_column('property', 'province')
    op.drop_column('property', 'projectid')
    op.drop_column('property', 'location')
    op.drop_column('property', 'full_address')
    op.drop_column('property', 'city')
    op.drop_index(op.f('ix_project_type'), table_name='project')
    op.drop_index(op.f('ix_project_name'), table_name='project')
    op.drop_index(op.f('ix_project_location'), table_name='project')
    op.drop_index(op.f('ix_project_latlng'), table_name='project')
    op.drop_table('project')
    ### end Alembic commands ###
