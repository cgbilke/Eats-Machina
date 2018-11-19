from enum import Enum

from OrderSystem.MenuItem import MenuItemAvailability, MenuItem
from OrderSystem.OrderItem import OrderItem


class OrderStatus(Enum):
    New = 1
    Ordered = 2
    Cooking = 3
    Cancelled = 4
    Complete = 5


class Order:

    tax_rate = 0.0945

    def __init__(self, diner_id: int, first_item: MenuItem, first_quantity: int=1, status: OrderStatus=OrderStatus.New):
        self.DinerID = diner_id
        self.Status = status
        self.TimePlaced = None
        self.SubTotal = 0.00
        self.TaxTotal = 0.00
        self.OrderTotal = 0.00
        self.OrderItems = []
        self.Payment = None

        self.add_item(first_item, first_quantity)

    def has_payment(self):
        return self.Payment is None

    def add_item(self, item: MenuItem, quantity: int=1):
        if item is None:
            print('Throw Exception: Invalid argument item')
            return
        ord_item = self.find_menu_item(item)
        if ord_item is None:
            ord_item = OrderItem(item, quantity)
            self.OrderItems.append(ord_item)
        self.calculate_total()

    def change_quantity(self, menu_item: MenuItem, new_quantity: int):
        ord_item = self.find_menu_item(menu_item)
        if ord_item is None:
            print('Throw Exception: Invalid menu_item')
            return
        ord_item.Quantity = new_quantity
        ord_item.calc_total()
        self.calculate_total()

    def remove_item(self, menu_item: MenuItem=None, order_item: OrderItem=None):
        if order_item is None:
            if menu_item is None:
                print('Throw Exception: Invalid argument: menu_item or order_item must be set and in the order.')
                return
            order_item = self.find_menu_item(menu_item)
            if order_item is None:
                print("This might be an error. But there's no matching order item to delete.")
                return
        self.OrderItems.remove(order_item)
        self.calculate_total()

    def find_menu_item(self, menu_item: MenuItem):
        matches = [oi for oi in self.OrderItems if oi.MenuItem == menu_item]
        if len(matches) > 0:
            return matches[0]
        else:
            return None

    def calculate_total(self):
        # use each item in this is an OrderItem object.
        self.SubTotal = sum([oi.calc_total() for oi in self.OrderItems])
        self.TaxTotal = round(self.calculate_tax(), 2)
        self.OrderTotal = self.SubTotal + self.TaxTotal

    def calculate_tax(self):
        return self.tax_rate * self.SubTotal

    def get_items(self):
        return self.OrderItems[:]

    def place_order(self):
        if len(self.validate()) == 0:
            self.Status = OrderStatus.Ordered

    def cancel_order(self):
        self.Status = OrderStatus.Cancelled

    def validate(self):
        response = []
        if len(self.OrderItems) == 0:
            response.append('This order is empty.')
        response.extend(['The item ' + item.Name + ' has a quantity of ' + item.Quantity for item in self.OrderItems if item.Quantity < 1])

        return response


def test_order_init():
    expected_diner_id = 143

    exp_item_1 = MenuItem(5381, 'Item One', 5.95, MenuItemAvailability.Available)
    exp_quan_1 = 1
    order = Order(expected_diner_id, exp_item_1)

    exp_sub_total = 5.95
    exp_tax_total = 0.56
    exp_ord_total = 6.51

    actual_sub_total = order.SubTotal
    actual_tax_total = order.TaxTotal
    actual_ord_total = order.OrderTotal

    if actual_sub_total != exp_sub_total:
        print('Problem with item subtotal for Order init. Expected', exp_sub_total, 'found', actual_sub_total)
    if actual_tax_total != exp_tax_total:
        print('Problem with tax total for Order init. Expected', exp_tax_total, 'found', actual_tax_total)
    if actual_ord_total != exp_ord_total:
        print('Problem with order total for Order init. Expected', exp_ord_total, 'found', actual_ord_total)

    exp_item_2 = MenuItem(59, 'Item Two', 3.00, MenuItemAvailability.Available)
    exp_quan_2 = 7

    exp_sub_total = 26.95
    exp_tax_total = 2.55
    exp_ord_total = 29.50

    order.add_item(exp_item_2, exp_quan_2)

    actual_sub_total = order.SubTotal
    actual_tax_total = order.TaxTotal
    actual_ord_total = order.OrderTotal

    if actual_sub_total != exp_sub_total:
        print('Problem with item subtotal for Order add_item. Expected', exp_sub_total, 'found', actual_sub_total)
    if actual_tax_total != exp_tax_total:
        print('Problem with tax total for Order add_item. Expected', exp_tax_total, 'found', actual_tax_total)
    if actual_ord_total != exp_ord_total:
        print('Problem with order total for Order add_item. Expected', exp_ord_total, 'found', actual_ord_total)

    # Test Find Menu Item

    exp_quan_1 = 3
    exp_sub_total = 38.85
    exp_tax_total = 3.67
    exp_ord_total = 42.52

    order.change_quantity(exp_item_1, exp_quan_1)

    actual_sub_total = order.SubTotal
    actual_tax_total = order.TaxTotal
    actual_ord_total = order.OrderTotal

    if actual_sub_total != exp_sub_total:
        print('Problem with item subtotal for Order change_quantity. Expected', exp_sub_total, 'found', actual_sub_total)
    if actual_tax_total != exp_tax_total:
        print('Problem with tax total for Order change_quantity. Expected', exp_tax_total, 'found', actual_tax_total)
    if actual_ord_total != exp_ord_total:
        print('Problem with order total for Order change_quantity. Expected', exp_ord_total, 'found', actual_ord_total)

# if __name__ == '__main__':
#    test_order_init()
