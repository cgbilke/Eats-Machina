from enum import Enum
from collections import namedtuple


class MenuItemAvailability(Enum):
    Available = 1
    OutOfStock = 2
    OutOfSeason = 3


Menu_Item = namedtuple('Menu_Item', ['ID', 'name', 'description', 'price'])


