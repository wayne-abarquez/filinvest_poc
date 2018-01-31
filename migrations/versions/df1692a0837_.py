"""empty message

Revision ID: df1692a0837
Revises: 4164f6638019
Create Date: 2018-01-31 01:05:16.206689

"""

# revision identifiers, used by Alembic.
revision = 'df1692a0837'
down_revision = '4164f6638019'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('completion', sa.SmallInteger(), nullable=False))
    op.add_column('property', sa.Column('completion', sa.SmallInteger(), nullable=False))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('property', 'completion')
    op.drop_column('project', 'completion')
    ### end Alembic commands ###