mport string
import json

from collections import namedtuple

#Not the Final menu
#Class definition for menu item incase swtich is needed for JSON
#idC = 1;
#class menu_item:
    #id = -1
    #name = 'null'
    #description = 'null'
    #price = 'null'
    #def __init__(self,name,description,price):
        #global idC;
        #self.id = idC
        #idC += 1
        #self.name=name
        #self.description=description
        #self.price=price
#menuCl = []
#menuCl.append(menu_item('Hamburger' ,  'Juicy hamburger made with prime beef',   '$5.00'))
#menuCl.append(menu_item('Chilli Dog','Chilli dog served with chilli and cheese','$3.25'))
#menuCl.append(menu_item('Nachos','Nachos served with chilli, chesse and jalapenos', '$3.50'))
#menuCl.append(menu_item('Tacos','Your choice of hard or so˙˙t shelled Taco, toppings included' ,'$5.25'))
#menuCl.append(menu_item('Pizza','Large hand tossed pizza', '$5.00'))

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
        return(json.dumps(menu))
    def FindMenuItem(searchString):
        print(searchString)
    for entry in menu:
        if entry[1]==searchString:
            return(json.dumps(entry))
    return 'menu item not found'
