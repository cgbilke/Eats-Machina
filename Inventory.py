# from django.contrib import admin
# from django.urls import path
import enum

# urlpatterns = [
  #   path('admin/', admin.site.urls),
# ]
Objectlist = []


class InvItem(enum.Enum):
    Name = ''
    Amount = 0
    price = 0.0
    key = -1


class Inventory:
    def __init__(self, nombre, qty, cost):
        self.Name = nombre
        self.Amount = qty
        self.price = cost
        Objectlist.append(self)
        self.key = Objectlist.len()

    def add_to(self, qty):
        self.Amount += qty

    def sub_to(self, qty):
        self.Amount = self.Amount - qty

    def remove_obj(self):
        del Objectlist[self.key]

    def quantity(self):
        return self.Amount

    def priceperunit(self):
        return self.price

    def totalprice(self):
        x = self.Amount * self.price
        return x

    def changename(self, newnombre):
        self.Name = newnombre

    def updatecost(self, newcost):
        self.price = newcost

    def changequantity(self, newqty):
        self.Amount = newqty
