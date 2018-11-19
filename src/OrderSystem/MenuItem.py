from enum import Enum


class MenuItemAvailability(Enum):
    Available = 1
    OutOfStock = 2
    OutOfSeason = 3


class MenuItem:

    def __init__(self, id:int = 0, name:str='', price=0.00, availability:MenuItemAvailability=1):
        self.ID = id
        self.Name = name
        self.Price = price
        self.Availability = availability


