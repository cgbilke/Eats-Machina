import string
from collections import namedtuple
# Not the Final menu

Menu_Item = namedtuple('Menu_Item', ['ID','name','description','price'])
menu = []
menu.append(Menu_Item(1, 'Hamburger' ,  'Juicy hamburger made with prime beef',   '$5.00'))
menu.append(Menu_Item(2, 'Chilli Dog','Chilli dog served with chilli and cheese','$3.25'))
menu.append(Menu_Item(3, 'Nachos','Nachos served with chilli, chesse and jalapenos', '$3.50'))
menu.append(Menu_Item(4, 'Tacos','Your choice of hard or soft shelled Taco, toppings included' ,'$5.25'))
menu.append(Menu_Item(5, 'Pizza','Large hand tossed pizza', '$5.00'))

for entry in menu:
    ID= str(getattr(entry,'ID')).ljust(10)
    description = getattr(entry,'description').ljust(65)
    price = getattr(entry,'price').ljust(25)
    name = getattr(entry, 'name').ljust(15)
    print ('{0}{1}{2}{3}'.format(ID, name , description , price))

def GetAvailableItems():
# will work with inventory
    print (menu)

def FindMenuItem(search_text: string):
# Needs work
    string = menu.name
    string.find(name)


