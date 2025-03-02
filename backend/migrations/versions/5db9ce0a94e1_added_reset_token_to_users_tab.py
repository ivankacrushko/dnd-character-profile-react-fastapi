"""Added reset token to users tab

Revision ID: 5db9ce0a94e1
Revises: 7b3fdc454d3f
Create Date: 2025-03-02 13:18:26.742517

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5db9ce0a94e1'
down_revision: Union[str, None] = '7b3fdc454d3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
