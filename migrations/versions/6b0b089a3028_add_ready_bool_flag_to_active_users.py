"""add ready bool flag to active users

Revision ID: 6b0b089a3028
Revises: 780923972868
Create Date: 2023-01-09 20:35:32.206874

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b0b089a3028'
down_revision = '780923972868'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('active_users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ready', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('active_users', schema=None) as batch_op:
        batch_op.drop_column('ready')

    # ### end Alembic commands ###